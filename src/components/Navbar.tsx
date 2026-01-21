
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Location', href: 'https://maps.app.goo.gl/iUDm3AZMNMM91PDN6?g_st=aw' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Branches', href: '#branches' },
    { name: 'Internship', href: '#internship' },
    { name: 'Activities', href: '#activities' },
    { name: 'Notice', href: '#notices' },
    { name: 'Causes', href: '#causes' },
    { name: 'News', href: '#news' },
    { name: 'Donate', href: '#donation' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('http')) return; // Allow external links to behave normally
    
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    
    if (elem) {
      // Calculate position accounting for fixed navbar height
      const navbarHeight = isScrolled ? 80 : 160; 
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      id="navbar" 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
        !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${
        isScrolled 
          ? 'glass-nav shadow-lg border-slate-200/50 py-3' 
          : 'bg-white border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col items-center mb-4">
          <img 
            src="download-WeResize.com (1).png" 
            alt="Roti Bank Bettiah Logo" 
            className={`rounded-full shadow-lg border-2 border-emerald-50 transition-all duration-500 ${isScrolled ? 'h-10' : 'h-14'} mb-3 cursor-pointer`} 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')}
            className={`font-extrabold tracking-tight text-emerald-800 transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-3xl lg:text-4xl'}`}
          >
            Roti Bank Bettiah <span className="text-emerald-600/80">(रोटी बैंक बेतिया)</span>
          </a>
          {!isScrolled && (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 block animate-fade-in">
              Reg. No.- 5071/2023
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              target={link.name === 'Location' ? '_blank' : '_self'}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-emerald-600 transition-all duration-200 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="#donation" 
            onClick={(e) => handleLinkClick(e, '#donation')}
            className={`ml-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 ${isScrolled ? 'scale-90' : 'scale-100'}`}
          >
            Donate Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
