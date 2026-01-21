
import React from 'react';

interface HeroProps {
  customBanner?: string;
}

const Hero: React.FC<HeroProps> = ({ customBanner }) => {
  const bannerImage = customBanner || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2070";

  return (
    <section id="home" className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Dynamic Background Image with sophisticated Overlay */}
      <div className="absolute inset-0">
        <img 
          src={bannerImage} 
          alt="Roti Bank Banner" 
          className="w-full h-full object-cover scale-105 animate-[slow-zoom_20s_infinite]"
        />
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full mb-10 animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Non-Profit Organization</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tighter animate-slide-up">
            Nourishing <span className="text-emerald-400">Lives</span>, <br/>
            Sharing <span className="underline decoration-emerald-500/50 underline-offset-8">Compassion</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-xl font-medium leading-relaxed animate-slide-up [animation-delay:200ms]">
            Since 2023, we've served over half a million meals to the underprivileged in Bettiah. Join our mission to end hunger today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 animate-slide-up [animation-delay:400ms]">
            <a href="#donation" className="group px-10 py-5 bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3">
              Become a Donor <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
            </a>
            <a href="#about" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center">
              Our Mission
            </a>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </section>
  );
};

export default Hero;
