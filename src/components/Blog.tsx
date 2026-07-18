import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogItem } from '../types';

interface BlogProps {
  blogs: BlogItem[];
}

const cleanPreviewText = (text: string): string => {
  // Remove markdown headers, bold syntax, images, CTAs, list items, and links for a clean preview
  let cleaned = text
    .replace(/^#+\s+/gm, '') // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[CTA:[^\]]*\]/g, '') // CTAs
    .replace(/^\s*[-*]\s+/gm, '') // bullet lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/\n+/g, ' ') // newlines to space
    .trim();
  
  if (cleaned.length > 200) {
    return cleaned.substring(0, 200) + '...';
  }
  return cleaned;
};

const renderBlogContent = (content: string) => {
  const lines = content.split('\n');
  let inList = false;
  const listItems: string[] = [];
  const elements: React.ReactNode[] = [];

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    // Splits by bold **text** and link [label](url) patterns
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.includes('](')) {
        const closeBracket = part.indexOf(']');
        const label = part.slice(1, closeBracket);
        const url = part.slice(closeBracket + 2, -1);
        
        // Internal page scroll or external link
        const isAnchor = url.startsWith('#');
        return (
          <a
            key={index}
            href={url}
            target={isAnchor ? '_self' : '_blank'}
            rel={isAnchor ? undefined : 'noopener noreferrer'}
            className="text-emerald-600 font-bold hover:text-emerald-800 underline decoration-2 decoration-emerald-200 hover:decoration-emerald-500 transition-all"
          >
            {label}
          </a>
        );
      }
      return part;
    });
  };

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 space-y-2.5 my-6 text-slate-655 text-base leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="marker:text-emerald-500">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems.length = 0;
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for CTA block: [CTA: 100]
    if (trimmed.startsWith('[CTA:') && trimmed.endsWith(']')) {
      flushList(index);
      const amount = parseInt(trimmed.replace('[CTA:', '').replace(']', '').trim());
      if (!isNaN(amount)) {
        const impactText = amount === 100 
          ? "While you build your local kitchen, you can support ours. Just ₹100 feeds 10 people tonight."
          : amount === 500
          ? "Support transparent philanthropy. A small contribution of ₹500 feeds an entire family of four for a week in Bettiah, Bihar."
          : "Sponsor a full night's distribution. ₹1,000 feeds 100 hungry people on the streets of West Champaran, Bihar.";
        
        const buttonLabel = amount === 1000 ? "Sponsor Drive" : `Donate ₹${amount} Now`;

        elements.push(
          <div 
            key={`cta-${index}`} 
            className="my-10 p-6 md:p-8 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-[2.5rem] shadow-xl border border-emerald-500/10 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl group-hover:bg-emerald-600/20 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-emerald-500/25 border border-emerald-400/20 text-emerald-300 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Direct Impact Initiative
                </span>
                <h4 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Make a Difference Instantly</h4>
                <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xl">{impactText}</p>
              </div>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('select-donation-amount', { detail: { amount } }));
                }}
                className="px-8 py-3.5 bg-white text-emerald-800 font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-2"
              >
                <i className="fas fa-heart text-red-500 animate-pulse"></i>
                {buttonLabel}
              </button>
            </div>
          </div>
        );
        return;
      }
    }

    // Check for image syntax: ![caption](/path/to/image)
    if (trimmed.startsWith('![') && trimmed.includes('](') && trimmed.endsWith(')')) {
      flushList(index);
      const closeBracket = trimmed.indexOf(']');
      const caption = trimmed.slice(2, closeBracket);
      const url = trimmed.slice(closeBracket + 2, -1);
      elements.push(
        <div key={`img-${index}`} className="my-8 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img src={url} alt={caption} className="w-full h-auto object-cover max-h-[450px] block" />
          {caption && (
            <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-wider py-3.5 bg-white border-t border-slate-100">
              <i className="fas fa-camera mr-2 text-emerald-500"></i>
              {caption}
            </p>
          )}
        </div>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h4 key={index} className="text-lg md:text-xl font-black text-slate-800 mt-8 mb-4 tracking-tight uppercase flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
          {parseInlineMarkdown(trimmed.replace('### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h3 key={index} className="text-xl md:text-2xl font-black text-slate-900 mt-12 mb-6 tracking-tight border-b border-slate-100 pb-3 uppercase">
          {parseInlineMarkdown(trimmed.replace('## ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList(index);
      elements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-14 mb-8 tracking-tight uppercase">
          {parseInlineMarkdown(trimmed.replace('# ', ''))}
        </h2>
      );
    } 
    // Horizontal divider
    else if (trimmed === '---') {
      flushList(index);
      elements.push(
        <hr key={index} className="my-10 border-slate-200/60" />
      );
    }
    // Lists
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      listItems.push(trimmed.slice(2));
    } 
    // Regular paragraphs
    else if (trimmed.length > 0) {
      flushList(index);
      elements.push(
        <p key={index} className="text-slate-600 leading-relaxed text-base mb-5 font-normal">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    } else {
      flushList(index);
    }
  });

  flushList(lines.length);
  return elements;
};

const Blog: React.FC<BlogProps> = ({ blogs }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-white scroll-mt-24 reveal">
      <div className="container mx-auto px-6 max-w-5xl">
        <span className="block text-center mb-6">
          <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <i className="fas fa-book-open mr-2"></i>Knowledge Base
          </span>
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-4 section-title tracking-tight uppercase">
          Insight & Resources
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-16 text-base md:text-lg">
          Learn about grassroots operations, transparency benchmarks, and our daily commitment to combating hunger.
        </p>
        
        <div className="space-y-12">
          {blogs.map((blog) => {
            const isExpanded = expandedId === blog.id;
            const previewText = cleanPreviewText(blog.content);

            return (
              <motion.article 
                key={blog.id} 
                layout="position"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight hover:text-emerald-700 transition-colors uppercase tracking-tight">
                    {blog.title}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-100/50 px-4 py-2 rounded-full whitespace-nowrap">
                    <i className="far fa-calendar-alt mr-1.5"></i>
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
                
                <div className="prose max-w-none">
                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.div
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-8"
                      >
                        {renderBlogContent(blog.content)}
                      </motion.div>
                    ) : (
                      <motion.p
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-slate-500 leading-relaxed text-base mb-8 font-medium"
                      >
                        {previewText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/60 pt-6 mt-6">
                  <button 
                    onClick={() => {
                      setExpandedId(isExpanded ? null : blog.id);
                      if (isExpanded) {
                        // Scroll back to the blog item header
                        const element = document.getElementById(blog.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    {isExpanded ? (
                      <>Read Less <i className="fas fa-chevron-up"></i></>
                    ) : (
                      <>Read Full Guide <i className="fas fa-chevron-down"></i></>
                    )}
                  </button>
                  
                  {!isExpanded && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:inline">
                      ~10 Min Read
                    </span>
                  )}
                </div>
                
                {/* ID anchor for scrolling back after reading less */}
                <div id={blog.id} className="scroll-mt-32" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Blog;
