
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';

interface NavbarProps {
  news?: NewsItem[];
}

const Navbar: React.FC<NavbarProps> = ({ news = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headlines = news.filter(item => item.is_headline);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Gallery', href: '#gallery', icon: 'fa-images' },
    { name: 'Media', href: '#media', icon: 'fa-play' },
    { name: 'About', href: '#about', icon: 'fa-heart' },
    { name: 'Location', href: 'https://maps.app.goo.gl/iUDm3AZMNMM91PDN6?g_st=aw', icon: 'fa-map-marker-alt' },
    { name: 'Achievements', href: '#achievements', icon: 'fa-trophy' },
    { name: 'Branches', href: '#branches', icon: 'fa-building' },
    { name: 'Internship', href: '#internship', icon: 'fa-graduation-cap' },
    { name: 'Activities', href: '#activities', icon: 'fa-calendar' },
    { name: 'Notice', href: '#notices', icon: 'fa-bullhorn' },
    { name: 'Causes', href: '#causes', icon: 'fa-seedling' },
    { name: 'News', href: '#news', icon: 'fa-newspaper' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('http')) return;
    
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const navbarHeight = isScrolled ? 80 : 100; 
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav 
        id="navbar" 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
          !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        } ${
          isScrolled 
            ? 'glass-nav shadow-lg border-slate-200/50' 
            : 'bg-white border-transparent'
        }`}
      >
        <div className={`container mx-auto px-4 md:px-6 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
          {/* Top: Logo + Brand + Hamburger */}
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="/logo.png" 
                width={48}
                height={48}
                alt="Roti Bank Bettiah Logo" 
                className={`rounded-full shadow-lg border-2 border-emerald-50 transition-all duration-500 ${isScrolled ? 'h-9' : 'h-12'}`}
              />
              <div>
                <h1 className={`font-extrabold tracking-tight text-emerald-800 transition-all duration-500 leading-tight ${isScrolled ? 'text-base' : 'text-lg md:text-2xl'}`}>
                  Roti Bank Bettiah Trust
                </h1>
                {!isScrolled && (
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] block animate-fade-in">
                    रोटी बैंक बेतिया ट्रस्ट • Reg. No. 5071/2023
                  </span>
                )}
              </div>
            </div>

            {/* Desktop: Donate Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="#donation" 
                onClick={(e) => handleLinkClick(e, '#donation')}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95 donate-btn-shimmer flex items-center gap-2"
                id="nav-donate-btn"
              >
                <i className="fas fa-heart text-[8px] animate-heartbeat"></i>
                Donate Now
              </a>
            </div>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
              </div>
            </button>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mt-3">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                target={link.name === 'Location' ? '_blank' : '_self'}
                rel={link.name === 'Location' ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>
        </div>

        {/* News Ticker */}
        {headlines.length > 0 && (
          <div className="bg-emerald-700/95 text-white text-xs w-full overflow-hidden flex items-center h-8 border-t border-emerald-600/50 shadow-inner backdrop-blur-sm">
            <div className="bg-emerald-800 px-3 py-2 font-bold uppercase tracking-widest z-10 flex-shrink-0 flex items-center h-full shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Latest News
              </span>
            </div>
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
                {headlines.map((item, i) => (
                  <div key={item.id} className="inline-flex items-center gap-2 group cursor-default">
                    <span className="font-bold text-white group-hover:text-emerald-200 transition-colors">{item.title}</span>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-amber-300 hover:text-amber-100 underline uppercase font-bold text-[10px] tracking-widest transition-colors inline-flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        Click Here <i className="fas fa-external-link-alt text-[8px]"></i>
                      </a>
                    )}
                    <i className="fas fa-star text-[6px] text-emerald-400/50 ml-8"></i>
                  </div>
                ))}
                {/* Duplicate for infinite marquee effect */}
                {headlines.map((item, i) => (
                  <div key={`${item.id}-dup`} className="inline-flex items-center gap-2 group cursor-default">
                    <span className="font-bold text-white group-hover:text-emerald-200 transition-colors">{item.title}</span>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-amber-300 hover:text-amber-100 underline uppercase font-bold text-[10px] tracking-widest transition-colors inline-flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        Click Here <i className="fas fa-external-link-alt text-[8px]"></i>
                      </a>
                    )}
                    <i className="fas fa-star text-[6px] text-emerald-400/50 ml-8"></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 mobile-menu-overlay lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[300px] z-[45] mobile-menu-panel shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20 h-full overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name === 'Location' ? '_blank' : '_self'}
                rel={link.name === 'Location' ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all font-medium text-sm"
              >
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${link.icon} text-slate-400 text-xs`}></i>
                </div>
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Donate Button */}
          <div className="mt-8 px-4">
            <a
              href="#donation"
              onClick={(e) => handleLinkClick(e, '#donation')}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all donate-btn-shimmer"
            >
              <i className="fas fa-heart animate-heartbeat"></i>
              Donate Now
            </a>
          </div>

          {/* Mobile Contact */}
          <div className="mt-8 px-4 space-y-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contact</p>
            <a href="tel:+919473228888" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              <i className="fas fa-phone-alt text-emerald-500 text-xs"></i>
              +91 9473228888
            </a>
            <a href="mailto:rotibankbettiah@gmail.com" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              <i className="fas fa-envelope text-emerald-500 text-xs"></i>
              rotibankbettiah@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
