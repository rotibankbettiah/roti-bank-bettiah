import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  customBanner?: string;
}

const Hero: React.FC<HeroProps> = ({ customBanner }) => {
  const bannerImage = customBanner || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=75&w=1200&fm=webp";
  const [mealCount, setMealCount] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);

  // Animated meal counter
  useEffect(() => {
    const target = 500000;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } },
  };

  return (
    <section id="home" className="relative h-[90vh] min-h-[650px] flex items-center overflow-hidden bg-slate-900">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y1, opacity: opacity1 }}
      >
        <img 
          src={bannerImage} 
          alt="Roti Bank Bettiah serving meals to the underprivileged in Bihar" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-emerald-900/40"></div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              background: i % 2 === 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.2)',
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, (i % 2 === 0 ? 50 : -50), 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-white mt-10">
        <motion.div 
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full mb-10 shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-50">Verified Non-Profit Organization</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Roti Bank Bettiah</span> — <br/>
            Nourishing <span className="relative inline-block">
              Lives
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-emerald-500/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 25 5, 50 15 T 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>, Sharing Compassion.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-12 max-w-xl font-medium leading-relaxed">
            Since 2023, our food bank NGO in West Champaran, Bihar has served over 500,000+ free meals to the hungry and underprivileged. Join our mission to end hunger today.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
            <motion.a 
              href="#donation" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-emerald-500 text-slate-900 rounded-full font-black uppercase tracking-widest text-xs shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Become a Donor <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.a>
            <motion.a 
              href="#about" 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center"
            >
              Our Mission
            </motion.a>
          </motion.div>

          {/* Trust Ribbon */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-16">
            {[
              { icon: 'fa-utensils', label: 'Meals Served', value: mealCount.toLocaleString('en-IN') + '+' },
              { icon: 'fa-certificate', label: 'ISO Certified', value: 'NGO' },
              { icon: 'fa-file-shield', label: 'Reg. No.', value: '5071/2023' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/5 px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-default">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shadow-inner border border-emerald-500/20">
                  <i className={`fas ${item.icon} text-emerald-400 text-sm`}></i>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-200/70 font-bold uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* SVG Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] text-slate-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,122.38,197.8,111.44C240.84,104.38,283.4,85.6,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
