import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingDonateButtonProps {
  onDonateClick: () => void;
}

const FloatingDonateButton: React.FC<FloatingDonateButtonProps> = ({ onDonateClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pulse every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="floating-donate"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.button
            id="floating-donate-btn"
            onClick={onDonateClick}
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl group"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Donate Now"
          >
            {/* Animated ring */}
            {showPulse && (
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-30"></div>
            )}
            
            <i className="fas fa-heart text-lg relative z-10 group-hover:scale-110 transition-transform"></i>
            
            {/* Label on hover */}
            <div className="hidden sm:block absolute right-full mr-3 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none text-left">
              <span>Donate Now</span>
              <span className="text-[9px] text-emerald-400 block font-normal">50,000+ meals served</span>
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingDonateButton;
