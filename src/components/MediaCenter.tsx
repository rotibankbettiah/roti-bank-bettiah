import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '../types';

interface MediaCenterProps {
  items: MediaItem[];
}

const MediaCenter: React.FC<MediaCenterProps> = ({ items }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'youtube' | 'instagram'>('all');
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getInstagramId = (url: string) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (item: MediaItem) => {
    if (item.type === 'youtube') {
      const id = getYouTubeId(item.url);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
    } else {
      const id = getInstagramId(item.url);
      return id ? `https://www.instagram.com/reel/${id}/embed` : '';
    }
  };

  const getThumbnail = (item: MediaItem) => {
    if (item.type === 'youtube') {
      const id = getYouTubeId(item.url);
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    }
    return ''; // Instagram reels don't have public direct thumbnail URLs without API keys
  };

  const filteredItems = items.filter(
    (item) => activeFilter === 'all' || item.type === activeFilter
  );

  return (
    <section id="media" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-24">
      {/* Decorative details */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl -ml-40 -mt-40"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl -mr-40 -mb-40"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-play mr-2"></i> Media Feed
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 section-title tracking-tight">
            Latest from YouTube & Instagram
          </h2>
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg">
            Stay updated with our daily updates, operation stories, and social impacts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {(['all', 'youtube', 'instagram'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-800/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
              }`}
            >
              {filter === 'all'
                ? 'All Media'
                : filter === 'youtube'
                ? 'YouTube Videos'
                : 'Instagram Reels'}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group cursor-pointer"
                onClick={() => setActiveVideo(item)}
              >
                {/* Media Preview Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex-shrink-0">
                  {item.type === 'youtube' ? (
                    <img
                      src={getThumbnail(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // Instagram Reel fallback representation
                    <div className="w-full h-full bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-red-300 to-indigo-900"></div>
                      <i className="fab fa-instagram text-white text-6xl drop-shadow-lg opacity-90"></i>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg">
                      <i className="fas fa-play text-white text-xl ml-1"></i>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className={`absolute top-4 left-4 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-sm flex items-center gap-1.5 ${
                    item.type === 'youtube' ? 'bg-red-700' : 'bg-gradient-to-r from-purple-600 to-pink-500'
                  }`}>
                    <i className={item.type === 'youtube' ? 'fab fa-youtube' : 'fab fa-instagram'}></i>
                    {item.type}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-600 group-hover:text-emerald-600 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider">Play Video</span>
                    <i className="fas fa-chevron-right text-xs transform group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 mx-auto">
              <i className="fas fa-video-slash text-2xl"></i>
            </div>
            <p className="text-slate-500 font-medium">No media uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                    activeVideo.type === 'youtube' ? 'bg-red-700' : 'bg-gradient-to-r from-purple-600 to-pink-500'
                  }`}>
                    <i className={activeVideo.type === 'youtube' ? 'fab fa-youtube' : 'fab fa-instagram'}></i>
                  </span>
                  <h3 className="font-extrabold text-slate-800 line-clamp-1 max-w-xs sm:max-w-md md:max-w-xl">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Player Body */}
              <div className="relative aspect-video w-full bg-black">
                {activeVideo.type === 'youtube' ? (
                  <iframe
                    src={getEmbedUrl(activeVideo)}
                    title={activeVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  // Instagram Reels need embed iframe
                  <iframe
                    src={getEmbedUrl(activeVideo)}
                    title={activeVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                  ></iframe>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MediaCenter;
