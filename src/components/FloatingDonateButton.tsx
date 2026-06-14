
import React, { useState, useEffect } from 'react';

interface FloatingDonateButtonProps {
  onDonateClick: () => void;
}

const FloatingDonateButton: React.FC<FloatingDonateButtonProps> = ({ onDonateClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mealCount, setMealCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (~600px)
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated meal counter
  useEffect(() => {
    const target = 500000;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setMealCount(target);
        clearInterval(timer);
      } else {
        setMealCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="floating-donate">
      <button
        onClick={onDonateClick}
        className="flex items-center gap-3 px-6 py-4 text-white rounded-full font-bold shadow-2xl active:scale-95 transition-all group"
        aria-label="Donate Now"
        id="floating-donate-btn"
      >
        <span className="relative">
          <i className="fas fa-heart text-lg animate-heartbeat"></i>
        </span>
        <span className="flex flex-col items-start">
          <span className="text-sm font-black uppercase tracking-wider">Donate Now</span>
          <span className="text-[9px] text-emerald-100 font-medium tracking-wide">
            {mealCount.toLocaleString('en-IN')}+ meals served
          </span>
        </span>
        <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
      </button>
    </div>
  );
};

export default FloatingDonateButton;
