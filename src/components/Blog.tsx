import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogItem } from '../types';

interface BlogProps {
  blogs: BlogItem[];
}

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
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Latest Articles</h2>
        
        <div className="space-y-8">
          {blogs.map((blog) => {
            const isExpanded = expandedId === blog.id;
            // Get first 150 characters for preview
            const previewText = blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content;

            return (
              <motion.article 
                key={blog.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 group shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {blog.title}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-100/50 px-4 py-2 rounded-full whitespace-nowrap">
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
                
                <AnimatePresence mode="wait">
                  {isExpanded ? (
                    <motion.div
                      key="full"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-slate-600 leading-relaxed text-base space-y-4 mb-6 whitespace-pre-line"
                    >
                      {blog.content}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-slate-500 leading-relaxed text-base mb-6"
                    >
                      {previewText}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={() => setExpandedId(isExpanded ? null : blog.id)}
                  className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs hover:text-emerald-800 transition-colors"
                >
                  {isExpanded ? (
                    <>Read Less <i className="fas fa-chevron-up"></i></>
                  ) : (
                    <>Read More <i className="fas fa-chevron-down"></i></>
                  )}
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Blog;
