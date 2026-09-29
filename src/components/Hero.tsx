import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Tilt3DCard, Floating3D } from './ScrollAnimations';
import { supabaseService } from '../services/supabaseService';

interface HeroProps {
  customBanner?: string;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=75&w=1200&fm=webp";

const Hero: React.FC<HeroProps> = ({ customBanner }) => {
  const [heroImage, setHeroImage] = useState<string>(customBanner || '');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (customBanner) {
      setHeroImage(customBanner);
      setImgError(false);
    } else {
      let isMounted = true;
      supabaseService.getBanner().then((url) => {
        if (isMounted && url) {
          setHeroImage(url);
          setImgError(false);
        }
      }).catch((err) => {
        console.warn('Hero Supabase banner load notice:', err);
      });
      return () => {
        isMounted = false;
      };
    }
  }, [customBanner]);

  const activeBanner = (!imgError && heroImage) ? heroImage : DEFAULT_BANNER;
  const [mealCount, setMealCount] = useState(0);
  const rotatingWords = ['Lives', 'Hope', 'Dreams', 'Futures', 'Smiles', 'Hearts'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);
  const scale1 = useTransform(scrollY, [0, 500], [1, 1.1]);

  // Animated meal counter - authentic 50,000+ meals
  useEffect(() => {
    const target = 50000;
    const duration = 2500;
    const steps = 80;
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

  // Rotating words
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(wordTimer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18 } },
  };

  return (
    <section id="home" className="relative min-h-[calc(100vh-112px)] lg:min-h-[calc(100vh-144px)] flex items-center overflow-hidden bg-slate-950 pt-12 pb-20 md:py-24">
      {/* Parallax Background with zoom */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y1, opacity: opacity1, scale: scale1 }}
      >
        <img 
          src={activeBanner} 
          alt="Roti Bank Bettiah serving meals to the underprivileged in Bihar" 
          className="w-full h-full object-cover opacity-50"
          fetchPriority="high"
          onError={() => setImgError(true)}
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-emerald-950/50"></div>
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(16, 185, 129, 0.12), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.08), transparent 50%)'
        }}></div>
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 z-[1]"></div>

      {/* Floating Particles - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${5 + i * 7}%`,
              top: `${15 + (i % 4) * 22}%`,
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              background: i % 3 === 0 
                ? 'rgba(16, 185, 129, 0.5)' 
                : i % 3 === 1 
                ? 'rgba(6, 182, 212, 0.3)' 
                : 'rgba(255, 255, 255, 0.15)',
              boxShadow: i % 3 === 0 ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            }}
            animate={{
              y: [0, -120 - i * 10, 0],
              x: [0, (i % 2 === 0 ? 40 : -40), 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 -left-16 sm:-left-32 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/10 rounded-full blur-[120px] z-[1] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-16 sm:-right-32 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-[120px] z-[1] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-white mt-4 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Content */}
          <motion.div 
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 sm:gap-3 bg-white/[0.08] backdrop-blur-2xl border border-white/[0.1] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl mb-6 sm:mb-10 shadow-xl hover:bg-white/[0.12] transition-colors cursor-default max-w-full">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.18em] text-emerald-100 truncate">Registered Food NGO &amp; Trust | Reg. 5071/2023</span>
            </motion.div>
            
            {/* Main Heading - Responsive Typography */}
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-7xl lg:text-[4.8rem] font-black mb-6 leading-[1.12] sm:leading-[1.06] tracking-tight break-words">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">Roti Bank Bettiah</span>
              <br className="hidden md:block" />
              <span className="text-white"> Nourishing </span>
              <span className="relative inline-block align-bottom overflow-hidden max-w-full" style={{ height: '1.3em' }}>
                {/* Invisible words to auto-size container to the widest word */}
                {rotatingWords.map((word) => (
                  <span key={word} className="invisible font-black block h-0 overflow-hidden" aria-hidden="true">{word}</span>
                ))}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[currentWordIndex]}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 inline-block absolute left-0 bottom-0 w-full"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {rotatingWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
                <svg className="absolute w-full h-3 -bottom-0.5 left-0 text-amber-400/40 z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 25 5, 50 15 T 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
              <span className="text-white/80">,</span>
              <br className="hidden lg:block" />
              <span className="text-white"> Sharing Compassion.</span>
            </motion.h1>
            
            {/* Direct, non-vague hero copy */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-slate-300/90 mb-8 sm:mb-10 max-w-2xl font-normal leading-relaxed">
              A registered non-profit charitable trust delivering daily hot, hygienic meals to hospital patients at MJK Hospital, daily-wage laborers, and underprivileged families across Bettiah and West Champaran.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <motion.a 
                href="#donation" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 overflow-hidden w-full sm:w-auto text-center"
              >
                <i className="fas fa-heart text-xs text-slate-950"></i>
                <span>Donate a Meal</span>
                <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </motion.a>
              <motion.a 
                href="#about" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-xl text-white border border-white/[0.15] rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2.5 hover:border-white/[0.3] w-full sm:w-auto text-center"
              >
                <i className="fas fa-compass text-emerald-400 text-xs"></i>
                <span>Our Daily Mission</span>
              </motion.a>
            </motion.div>

            {/* Trust Ribbon */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 sm:gap-4 mt-8 sm:mt-12">
              {[
                { icon: 'fa-utensils', label: 'Daily Meals Served', value: mealCount.toLocaleString('en-IN') + '+', color: 'emerald' },
                { icon: 'fa-file-shield', label: 'Registered Trust', value: '5071/2023', color: 'cyan' },
                { icon: 'fa-certificate', label: 'Tax Exemption', value: '80G Approved', color: 'amber' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-2.5 sm:gap-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-white/[0.1] hover:border-white/[0.15] transition-all cursor-default group flex-1 min-w-[130px] sm:min-w-0 sm:flex-initial"
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 bg-${item.color === 'emerald' ? 'emerald' : item.color === 'cyan' ? 'cyan' : 'amber'}-500/20 rounded-lg flex items-center justify-center shadow-inner border border-${item.color === 'emerald' ? 'emerald' : item.color === 'cyan' ? 'cyan' : 'amber'}-500/30 flex-shrink-0`}>
                    <i className={`fas ${item.icon} text-${item.color === 'emerald' ? 'emerald' : item.color === 'cyan' ? 'cyan' : 'amber'}-400 text-xs`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-white/50 font-bold uppercase tracking-wider truncate">{item.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Interactive Hero Showcase */}
          <motion.div 
            className="block mt-10 lg:mt-0 lg:col-span-5 relative max-w-lg mx-auto lg:max-w-none w-full"
            initial={{ opacity: 0, scale: 0.92, rotateY: -12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.1, delay: 0.35, type: 'spring', stiffness: 50, damping: 18 }}
            style={{ perspective: '1200px' }}
          >
            <Tilt3DCard maxTilt={14} glare={true} className="relative z-10">
              <div className="relative bg-gradient-to-b from-white/[0.12] to-white/[0.04] backdrop-blur-2xl border border-white/[0.18] rounded-3xl p-7 shadow-2xl overflow-hidden">
                {/* 3D Depth Lights */}
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Live Badge */}
                <div className="flex items-center justify-between pb-5 border-b border-white/[0.1]">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Daily Seva Active</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/70 bg-white/[0.08] px-3 py-1 rounded-lg">6:30 PM Everyday</span>
                </div>

                {/* Center Visual Feature with 3D Depth */}
                <div className="my-6 relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-inner bg-slate-900/60 aspect-video flex items-center justify-center group/img">
                  <img
                    src={activeBanner}
                    alt="Roti Bank Bettiah daily food distribution"
                    className="w-full h-full object-cover opacity-90 group-hover/img:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-xs font-black uppercase tracking-wider text-white">MJK Hospital &amp; Station Relief</p>
                    <p className="text-[11px] text-emerald-300 font-medium mt-0.5">Fresh, nutritious meals distributed daily</p>
                  </div>
                </div>

                {/* Floating 3D Micro-Badges */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Floating3D depth={6} duration={4} delay={0}>
                    <div className="bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-xl p-3 text-center">
                      <div className="text-emerald-400 text-lg mb-1">
                        <i className="fas fa-hand-holding-heart"></i>
                      </div>
                      <p className="text-xs font-black text-white">100% Volunteer</p>
                      <p className="text-[10px] text-white/60">Zero Overhead Waste</p>
                    </div>
                  </Floating3D>

                  <Floating3D depth={6} duration={4.5} delay={0.6}>
                    <div className="bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-xl p-3 text-center">
                      <div className="text-amber-400 text-lg mb-1">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <p className="text-xs font-black text-white">80G Tax Exemption</p>
                      <p className="text-[10px] text-white/60">Instant 80G Receipt</p>
                    </div>
                  </Floating3D>
                </div>
              </div>
            </Tilt3DCard>
          </motion.div>
        </div>
      </div>

      {/* SVG Wave Bottom - Enhanced with gradient */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] sm:h-[80px]">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,122.38,197.8,111.44C240.84,104.38,283.4,85.6,321.39,56.44Z" fill="url(#wave-gradient)"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
