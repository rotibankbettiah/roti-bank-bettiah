
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import logoImg from '../assets/logo.png';

interface NavbarProps {
  news?: NewsItem[];
}

const Navbar: React.FC<NavbarProps> = ({ news = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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

  // Track active section
  useEffect(() => {
    const sections = ['gallery', 'media', 'about', 'achievements', 'branches', 'internship', 'activities', 'causes', 'donation'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
    { name: 'Volunteer', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog', icon: 'fa-hands-helping' },
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        } ${
          isScrolled 
            ? 'glass-nav shadow-lg' 
            : 'bg-white/95 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className={`container mx-auto px-4 md:px-6 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3.5'}`}>
          {/* Top: Logo + Brand + Hamburger */}
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative flex-shrink-0">
                <img 
                  src={logoImg} 
                  width={48}
                  height={48}
                  alt="Roti Bank Bettiah Logo" 
                  className={`rounded-full shadow-lg border-2 border-emerald-100 transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-10 w-10 sm:h-12 sm:w-12'}`}
                />
                {/* Active indicator dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg shadow-emerald-500/30"></div>
              </div>
              <div className="min-w-0">
                <span className={`font-extrabold tracking-tight text-slate-800 transition-all duration-500 leading-tight block group-hover:text-emerald-700 truncate ${isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg md:text-xl'}`}>
                  Roti Bank Bettiah Trust
                </span>
                {!isScrolled && (
                  <span className="text-[8px] sm:text-[9px] text-slate-600 font-bold uppercase tracking-[0.08em] sm:tracking-[0.15em] block truncate animate-fade-in">
                    रोटी बैंक बेतिया ट्रस्ट • Reg. No. 5071/2023
                  </span>
                )}
              </div>
            </div>

            {/* Desktop: Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2"
                id="nav-volunteer-btn"
              >
                <i className="fas fa-hands-helping text-xs text-emerald-600"></i>
                Volunteer
                <i className="fas fa-external-link-alt text-[9px] text-slate-400"></i>
              </a>
              <a 
                href="#donation" 
                onClick={(e) => handleLinkClick(e, '#donation')}
                className="relative px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2 group"
                id="nav-donate-btn"
              >

                <i className="fas fa-heart text-[8px] animate-heartbeat"></i>
                Donate Now
                <i className="fas fa-arrow-right text-[8px] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"></i>
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
          
          {/* Desktop Navigation Links - Enhanced with active indicator */}
          <div className="hidden lg:flex flex-wrap justify-center items-center gap-x-1 gap-y-1 mt-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a 
                  key={link.name} 
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg transition-all duration-200 relative group ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-emerald-500 rounded-full transition-all ${
                    isActive ? 'w-4' : 'w-0 group-hover:w-3'
                  }`}></span>
                </a>
              );
            })}
          </div>
        </div>

        {/* News Ticker - Enhanced */}
        {headlines.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white text-xs w-full overflow-hidden flex items-center h-8 border-t border-emerald-600/30 shadow-inner">
            <div className="bg-emerald-900/80 px-2.5 sm:px-3 py-2 font-bold uppercase tracking-widest z-10 flex-shrink-0 flex items-center h-full shadow-[4px_0_10px_rgba(0,0,0,0.2)] text-[10px] sm:text-xs">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Latest News
              </span>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
                {headlines.map((item) => (
                  <div key={item.id} className="inline-flex items-center gap-2 group cursor-default">
                    <span className="font-bold text-white group-hover:text-emerald-200 transition-colors">{item.title}</span>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Read article: ${item.title}`}
                        className="ml-2 text-amber-300 hover:text-amber-100 underline uppercase font-bold text-[10px] tracking-widest transition-colors inline-flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full"
                      >
                        Read Article <i className="fas fa-external-link-alt text-[8px]"></i>
                      </a>
                    )}
                    <i className="fas fa-star text-[6px] text-emerald-400/50 ml-8"></i>
                  </div>
                ))}
                {/* Duplicate for infinite marquee effect */}
                {headlines.map((item) => (
                  <div key={`${item.id}-dup`} className="inline-flex items-center gap-2 group cursor-default">
                    <span className="font-bold text-white group-hover:text-emerald-200 transition-colors">{item.title}</span>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Read article: ${item.title}`}
                        className="ml-2 text-amber-300 hover:text-amber-100 underline uppercase font-bold text-[10px] tracking-widest transition-colors inline-flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full"
                      >
                        Read Article <i className="fas fa-external-link-alt text-[8px]"></i>
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

      {/* Mobile Menu Panel - Enhanced */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] max-w-[85vw] z-[45] mobile-menu-panel shadow-2xl transform transition-all duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen 
            ? 'translate-x-0 opacity-100 visible pointer-events-auto' 
            : 'translate-x-full opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="p-6 pt-20 h-full overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="space-y-1">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <i className={`fas ${link.icon} text-xs`}></i>
                  </div>
                  {link.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                </a>
              );
            })}
          </div>

          {/* Mobile Donate Button */}
          <div className="mt-8 px-4">
            <a
              href="#donation"
              onClick={(e) => handleLinkClick(e, '#donation')}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-xl shadow-emerald-600/20 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 transition-all donate-btn-shimmer"
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
