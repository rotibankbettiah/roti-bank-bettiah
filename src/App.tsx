
import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import logoImg from './assets/logo.png';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Donation from './components/Donation';
import FloatingDonateButton from './components/FloatingDonateButton';
import { ScrollReveal3D, Tilt3DCard, ParallaxLayer } from './components/ScrollAnimations';
import { supabaseService } from './services/supabaseService';

// Lazy-loaded components for optimal bundle splitting
const Stats = React.lazy(() => import('./components/Stats'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const MediaCenter = React.lazy(() => import('./components/MediaCenter'));
const Blog = React.lazy(() => import('./components/Blog'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./components/TermsAndConditions'));
import {
  Activity,
  Achievement,
  Branch,
  NewsItem,
  Notice,
  InternshipContent,
  Cause,
  MediaItem,
  BlogItem
} from './types';

const App: React.FC = () => {
  const [data, setData] = useState<{
    gallery: Activity[],
    achievements: Achievement[],
    branches: Branch[],
    activities: Activity[],
    notices: Notice[],
    news: NewsItem[],
    internship: InternshipContent[],
    causes: Cause[],
    about: string,
    banner: string,
    media: MediaItem[],
    blogs: BlogItem[]
  }>({
    gallery: [],
    achievements: [],
    branches: [],
    activities: [],
    notices: [],
    news: [],
    internship: [],
    causes: [],
    about: '',
    banner: '',
    media: [],
    blogs: []
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideshowInterval = useRef<number | null>(null);

  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'privacy' | 'terms'>('home');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('privacy')) {
        setCurrentView('privacy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.includes('term')) {
        setCurrentView('terms');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.includes('volunteer')) {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (newView: 'home' | 'privacy' | 'terms') => {
    setCurrentView(newView);
    if (newView === 'privacy') {
      window.location.hash = '#/privacy-policy';
    } else if (newView === 'terms') {
      window.location.hash = '#/terms-and-conditions';
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fetchAllData = useCallback(async () => {
    // Helper to safely execute promises and fallback to defaults on DB exceptions
    const wrapSafe = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
      try {
        return await promise;
      } catch (err) {
        console.warn('Silent data load error:', err);
        return fallback;
      }
    };

    try {
      // Parallel fetch for optimal load times
      const [g, ach, br, act, not, nws, int, cs, ab, bn, md, bl] = await Promise.all([
        wrapSafe(supabaseService.getGalleryImages(), []),
        wrapSafe(supabaseService.getAchievements(), []),
        wrapSafe(supabaseService.getBranches(), []),
        wrapSafe(supabaseService.getActivities(), []),
        wrapSafe(supabaseService.getNotices(), []),
        wrapSafe(supabaseService.getNews(), []),
        wrapSafe(supabaseService.getInternshipContent(), []),
        wrapSafe(supabaseService.getCauses(), []),
        wrapSafe(supabaseService.getAboutContent(), ''),
        wrapSafe(supabaseService.getBanner(), ''),
        wrapSafe(supabaseService.getMediaItems(), []),
        wrapSafe(supabaseService.getBlogs(), [])
      ]);
      setData({ 
        gallery: g, 
        achievements: ach, 
        branches: br, 
        activities: act, 
        notices: not, 
        news: nws, 
        internship: int, 
        causes: cs, 
        about: ab,
        banner: bn,
        media: md,
        blogs: bl
      });
    } catch (err) {
      console.error("Data fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Slideshow Logic
  useEffect(() => {
    if (data.gallery.length > 0 && !isPaused) {
      slideshowInterval.current = window.setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % data.gallery.length);
      }, 4000);
    }
    return () => {
      if (slideshowInterval.current) clearInterval(slideshowInterval.current);
    };
  }, [data.gallery, isPaused]);

  // Scroll-reveal animation using IntersectionObserver — runs once on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe existing .reveal elements
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Watch for dynamically added .reveal elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal')) {
              observer.observe(node);
            }
            node.querySelectorAll?.('.reveal').forEach((el) => observer.observe(el));
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Handle scrolling to hash anchor on page load once data is fetched
  const hasScrolledRef = useRef(false);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !hasScrolledRef.current) {
      const targetId = hash.substring(1);
      const el = document.getElementById(targetId);
      if (el) {
        hasScrolledRef.current = true;
        // Small timeout to allow React DOM to fully render the children list
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [data]);

  const scrollToDonation = () => {
    const el = document.getElementById('donation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus('loading');
    setSubMessage('');
    try {
      await supabaseService.subscribeNewsletter(subEmail);
      setSubStatus('success');
      setSubMessage('Subscribed successfully! Thank you for joining our mission.');
      setSubEmail('');
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        setSubStatus('success');
        setSubMessage('You are already subscribed to our newsletter! Thank you.');
        setSubEmail('');
      } else if (err.code === 'PGRST205') {
        // The subscribers table has not been created yet in Supabase
        setSubStatus('error');
        setSubMessage('Subscription service is being set up. Please try again later.');
      } else {
        setSubStatus('error');
        setSubMessage('Failed to subscribe. Please try again later.');
      }
    }
  };

  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar news={data.news} />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading Privacy Policy...</div>}>
          <PrivacyPolicy onBack={() => navigateTo('home')} />
        </Suspense>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </div>
    );
  }

  if (currentView === 'terms') {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar news={data.news} />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading Terms & Conditions...</div>}>
          <TermsAndConditions onBack={() => navigateTo('home')} />
        </Suspense>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar news={data.news} />
      
      <main className="pt-24 sm:pt-28 lg:pt-36 max-w-full overflow-x-clip">
        <Hero customBanner={data.banner} />
        
        {/* Stats Quick View */}
        <ScrollReveal3D effect="tiltUp">
          <div id="stats-section" className="relative z-20 -mt-8 container mx-auto px-4 sm:px-6">
            <Suspense fallback={<div className="h-44 flex items-center justify-center text-slate-400">Loading Live Statistics...</div>}>
              <Stats />
            </Suspense>
          </div>
        </ScrollReveal3D>

        {/* Gallery Slideshow Section */}
        <ScrollReveal3D effect="flipUp">
        <section id="gallery" className="py-16 sm:py-24 bg-white overflow-hidden scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <i className="fas fa-camera mr-2"></i>Visual Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 section-title tracking-tight uppercase">Impact Gallery</h2>
            <p className="text-slate-500 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">Hover over photos to pause and view our mission in detail.</p>
            
            <div 
              className="relative max-w-5xl mx-auto h-[320px] sm:h-[450px] md:h-[600px] rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden group cursor-pointer border-4 sm:border-8 border-slate-50 bg-slate-900"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {data.gallery.length > 0 ? data.gallery.map((item, index) => {
                const isActive = index === activeSlide;
                const isAdjacent = Math.abs(index - activeSlide) <= 1;
                return (
                  <div 
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                  >
                    {isActive && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      ></div>
                    )}
                    
                    {isAdjacent && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title || 'Gallery image'} 
                        className="relative z-10 w-full h-full object-contain"
                        loading={isActive ? "eager" : "lazy"}
                        decoding="async"
                      />
                    )}
                    
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-12 text-left">
                      {item.title ? (
                        <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2">{item.title}</h3>
                      ) : (
                        <h3 className="sr-only">Gallery Image</h3>
                      )}
                      <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">{item.caption || 'Field Operations'}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
                  <div className="text-center">
                    <i className="fas fa-images text-4xl text-slate-400 mb-4 block"></i>
                    Loading Gallery Content...
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 md:right-12 z-30 flex gap-2 sm:gap-3">
                {data.gallery.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className="p-2 -m-2 group"
                    aria-label={`View slide ${idx + 1}`}
                  >
                    <div className={`h-2 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-6 sm:w-8 bg-emerald-500' : 'w-2 bg-white/50 group-hover:bg-white'}`} />
                  </button>
                ))}
              </div>

              {isPaused && (
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 bg-black/30 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <i className="fas fa-pause"></i> Paused
                </div>
              )}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Media Center Section */}
        <ScrollReveal3D effect="tiltLeft">
          <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading Media...</div>}>
            <MediaCenter items={data.media} />
          </Suspense>
        </ScrollReveal3D>

        {/* About Us Section */}
        <ScrollReveal3D effect="perspectiveIn">
        <section id="about" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-info-circle mr-2"></i>Who We Are
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-8 sm:mb-12 section-title tracking-tight uppercase">About Us</h2>
            <Tilt3DCard className="group">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-[3rem] shadow-xl shadow-emerald-100/30 border border-emerald-50/50 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-2xl sm:rounded-3xl flex items-center justify-center text-emerald-600 mb-6 sm:mb-8 mx-auto">
                <i className="fas fa-hand-holding-heart text-2xl sm:text-3xl"></i>
              </div>
              <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed font-medium italic">
                "{data.about || "Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free."}"
              </p>
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a href="#donation" className="inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 donate-btn-shimmer w-full sm:w-auto text-sm sm:text-base">
                  Support Our Mission <i className="fas fa-arrow-right text-xs"></i>
                </a>
                <a href="#achievements" className="inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-white text-slate-700 rounded-full font-bold border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-all w-full sm:w-auto text-sm sm:text-base">
                  Our Achievements <i className="fas fa-trophy text-xs text-emerald-500"></i>
                </a>
              </div>
            </div>
            </Tilt3DCard>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Why Donate Section */}
        <ScrollReveal3D effect="slideDepth">
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block px-5 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <i className="fas fa-lightbulb mr-2"></i>Why It Matters
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 section-title tracking-tight uppercase">Why Donate?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: 'fa-bowl-food',
                  title: 'Direct Impact',
                  desc: 'Every rupee goes directly towards purchasing and distributing food. No middlemen, no overhead waste.',
                  color: 'emerald',
                },
                {
                  icon: 'fa-shield-heart',
                  title: '100% Transparent',
                  desc: 'Registered NGO (5071/2023) with ISO certification. Every donation is tracked and reported.',
                  color: 'blue',
                },
                {
                  icon: 'fa-file-invoice',
                  title: 'Tax Benefits',
                  desc: 'All donations are eligible for tax deduction under Section 80G of the Income Tax Act.',
                  color: 'amber',
                },
              ].map((item, i) => (
                <Tilt3DCard key={i} className="group" maxTilt={10}>
                  <div className="bg-slate-50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 card-hover text-center glow-card-emerald h-full">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <i className={`fas ${item.icon} text-${item.color}-600 text-xl sm:text-2xl`}></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </Tilt3DCard>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Location Section */}
        <ScrollReveal3D effect="zoomRotate">
        <section id="location" className="py-16 sm:py-24 bg-slate-50 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-5 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <i className="fas fa-map-pin mr-2"></i>Visit Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 sm:mb-12 section-title tracking-tight uppercase">Our Location</h2>
            <Tilt3DCard className="max-w-3xl mx-auto group" maxTilt={8}>
            <div className="flex flex-col items-center bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <svg className="map-pin w-16 h-16 sm:w-20 sm:h-20 text-red-500 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.056 4.944A7.447 7.447 0 0110 2.5c4.142 0 7.5 3.358 7.5 7.5a7.447 7.447 0 01-2.444 5.056L10 20l-5.056-5.056A7.447 7.447 0 012.5 10c0-4.142 3.358-7.5 7.5-7.5zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 leading-tight">Visit Our Center</p>
              <p className="text-slate-500 mb-8 sm:mb-10 max-w-lg leading-relaxed text-sm sm:text-base">
                Kalibag Chowk, Bettiah, West Champaran, Bihar, 845438. Open daily for food distribution and aid.
              </p>
              <a href="https://maps.app.goo.gl/iUDm3AZMNMM91PDN6?g_st=aw" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-full font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm w-full sm:w-auto text-sm sm:text-base">
                <i className="fas fa-map-marked-alt text-emerald-500 group-hover:scale-110 transition-transform"></i>
                Open in Google Maps
              </a>
            </div>
            </Tilt3DCard>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Achievements Section */}
        <ScrollReveal3D effect="tiltUp">
        <section id="achievements" className="py-16 sm:py-24 bg-slate-900 text-white relative scroll-mt-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-white/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-medal mr-2"></i>Milestones
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 sm:mb-16 section-title tracking-tight uppercase">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
              {data.achievements.map((ach) => (
                <Tilt3DCard key={ach.id} className="group" maxTilt={8}>
                <article className="bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all h-full">
                  {ach.imageUrl && (
                    <div className="w-full h-[220px] sm:h-[280px] md:h-[350px] overflow-hidden rounded-2xl sm:rounded-[2.5rem] mb-6 sm:mb-8 shadow-2xl border-4 border-white/10 bg-slate-950/5 flex items-center justify-center">
                      <img 
                        src={ach.imageUrl} 
                        className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-700 block" 
                        alt={ach.description || 'Achievement image'} 
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-5 sm:mb-6 group-hover:rotate-12 transition-transform">
                    <i className={`fas ${ach.icon || 'fa-trophy'} text-xl sm:text-2xl`}></i>
                  </div>
                  {ach.count ? (
                    <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter">{ach.count}</h3>
                  ) : (
                    <h3 className="sr-only">Achievement Metric</h3>
                  )}
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 sm:mb-4">{ach.description}</p>
                  {ach.caption && ach.caption !== ach.description && <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{ach.caption}</p>}
                </article>
                </Tilt3DCard>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Our Branches Section */}
        <ScrollReveal3D effect="tiltRight">
        <section id="branches" className="py-16 sm:py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-map-location-dot mr-2"></i>Nationwide Network
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10 sm:mb-16 section-title tracking-tight uppercase">Our Branches</h2>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {data.branches.map((br) => (
                <Tilt3DCard key={br.id} className="w-full max-w-sm group" maxTilt={10}>
                <article className="bg-slate-50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[3rem] border border-slate-100 card-hover h-full">
                  <div className="mb-5 sm:mb-6 overflow-hidden rounded-xl sm:rounded-[2rem] bg-slate-950/5 flex items-center justify-center h-44 sm:h-48 w-full">
                    {br.imageUrl ? (
                      <img 
                        src={br.imageUrl} 
                        className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-700 block" 
                        alt={br.name || 'Branch image'} 
                        loading="lazy" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <i className="fas fa-building text-3xl sm:text-4xl"></i>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{br.name}</h3>
                  <p className="text-slate-500 font-medium mb-4 sm:mb-6 uppercase tracking-widest text-xs">{br.location}</p>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full"></span>
                  </div>
                </article>
                </Tilt3DCard>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Internship Section */}
        <ScrollReveal3D effect="tiltLeft">
        <section id="internship" className="py-16 sm:py-24 bg-emerald-900 text-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center max-w-6xl mx-auto">
              <div>
                <span className="inline-block px-5 py-2 bg-white/10 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <i className="fas fa-user-graduate mr-2"></i>Join Us
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-tight">Internship <span className="text-emerald-400">& Volunteering</span></h2>
                <p className="text-emerald-100 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                  Join our mission as a volunteer or student intern. Gain real-world social impact experience and help us bridge the gap between food waste and hunger.
                </p>
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                  {data.internship.map((item) => (
                    <div key={item.id} className="flex gap-4 sm:gap-5 items-start">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-400 mt-0.5">
                        <i className="fas fa-check-circle text-xs sm:text-base"></i>
                      </div>
                      {item.type === 'criteria' && <p className="text-white/90 font-medium text-sm sm:text-base">{item.content}</p>}
                      {item.type === 'certificate' && <p className="text-white/90 font-medium text-sm sm:text-base">Earn recognized certifications for your contribution.</p>}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white text-emerald-950 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-50 transition-all active:scale-95 shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-hands-helping text-emerald-700"></i>
                    Join as Volunteer
                    <i className="fas fa-external-link-alt text-[9px] text-emerald-600"></i>
                  </a>
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLScXUtdd9WqgGERF8iDaZrDslw10lidmvpyhyY8EtFQwIvdgBQ/viewform?usp=dialog" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-800 text-white border border-emerald-700 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-emerald-700 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-graduation-cap"></i>
                    Apply as Intern
                    <i className="fas fa-external-link-alt text-[9px] text-emerald-300"></i>
                  </a>
                </div>

              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                {data.internship.find(i => i.type === 'certificate')?.url && (
                  <img 
                    src={data.internship.find(i => i.type === 'certificate')?.url} 
                    className="relative z-10 w-full rounded-2xl sm:rounded-[2.5rem] shadow-2xl rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500" 
                    alt="Roti Bank Bettiah Internship Certificate Sample" 
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Activities Section */}
        <ScrollReveal3D effect="floatUp">
        <section id="activities" className="py-16 sm:py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-calendar-check mr-2"></i>Field Work
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10 sm:mb-16 section-title tracking-tight uppercase">Recent Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {data.activities.map((act) => (
                <Tilt3DCard key={act.id} className="group" maxTilt={6}>
                <article className="bg-slate-50 rounded-2xl sm:rounded-[3rem] overflow-hidden border border-slate-100 card-hover h-full">
                  <div className="overflow-hidden bg-slate-950/5 flex items-center justify-center h-48 sm:h-56 w-full">
                    <img 
                      src={act.imageUrl} 
                      className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500 block" 
                      alt={act.title || 'Activity image'} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="p-5 sm:p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">{act.title}</h3>
                      {act.caption && <span className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest self-start flex-shrink-0">{act.caption}</span>}
                    </div>
                    <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">{act.content}</p>
                  </div>
                </article>
                </Tilt3DCard>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Testimonials */}
        <ScrollReveal3D effect="perspectiveIn">
          <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading Testimonials...</div>}>
            <Testimonials />
          </Suspense>
        </ScrollReveal3D>

        {/* Notice & News Split Section */}
        <ScrollReveal3D effect="tiltUp">
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div id="notices" className="scroll-mt-32">
              <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-bullhorn text-emerald-600"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Notice Board</h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {data.notices.map((nt) => (
                  <article key={nt.id} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-200/50 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-slate-400"></i>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{nt.title}</h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{nt.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            
            <div id="news" className="scroll-mt-32">
              <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-newspaper text-emerald-600"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Latest News</h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                {data.news.filter(item => !item.is_headline).map((item) => (
                  <article key={item.id} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-3 sm:mb-4 block">{new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                    
                    {item.imageUrl && (
                      <div className="rounded-xl sm:rounded-[1.5rem] overflow-hidden mb-5 sm:mb-6 bg-slate-950/5 flex items-center justify-center border border-slate-200 h-[200px] sm:h-[250px] md:h-[300px] w-full">
                        <img 
                          src={item.imageUrl} 
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 hover:scale-102 block" 
                          alt={item.title || 'News image'} 
                          loading="lazy" 
                        />
                      </div>
                    )}
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 group-hover:text-emerald-700 transition-colors leading-tight">{item.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.content}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        {/* Blog Section */}
        <ScrollReveal3D effect="flipUp">
          <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading Blogs...</div>}>
            <Blog blogs={data.blogs} />
          </Suspense>
        </ScrollReveal3D>

        {/* Causes Section */}
        <ScrollReveal3D effect="slideDepth">
        <section id="causes" className="py-16 sm:py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-bullseye mr-2"></i>Progress Tracker
              </span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10 sm:mb-16 section-title tracking-tight uppercase">Ongoing Goals</h2>
            <div className="space-y-10 sm:space-y-16">
              {data.causes.map((cause) => {
                const progress = Math.min((cause.completed / cause.target) * 100, 100);
                return (
                  <div key={cause.id} className="space-y-4 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{cause.name}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Target Impact Progress</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xl sm:text-2xl font-black text-emerald-600">{Math.round(progress)}%</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase">{cause.completed.toLocaleString('en-IN')} / {cause.target.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 sm:h-5 shadow-inner overflow-hidden border border-slate-200">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
                        <div className="absolute top-0 right-0 w-2 h-full bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        </ScrollReveal3D>

        <ScrollReveal3D effect="flipUp">
          <Donation />
        </ScrollReveal3D>
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-950 text-white pt-16 sm:pt-24 pb-12 relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-[150px] pointer-events-none"></div>
        
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 text-center md:text-left border-b border-white/5 pb-12 sm:pb-16 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-6 sm:mb-8">
                <div className="relative">
                  <img src={logoImg} width={40} height={40} className="w-10 h-10 aspect-square object-contain rounded-full shadow-lg shadow-emerald-500/20" alt="Roti Bank Bettiah logo" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
                </div>
                <span className="font-black text-xl sm:text-2xl tracking-tight">Roti Bank Bettiah Trust</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 sm:mb-8 text-sm">
                Roti Bank Bettiah Trust is a registered non-profit NGO and charitable trust. Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5 sm:gap-3">
                {[
                  { href: 'https://www.facebook.com/ROTIBANKBETTIAH', icon: 'fab fa-facebook', label: 'Facebook', hoverBg: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30' },
                  { href: 'https://twitter.com/Rotibankbettiah', icon: 'fab fa-twitter', label: 'Twitter', hoverBg: 'hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30' },
                  { href: 'https://instagram.com/rotibankbettiah', icon: 'fab fa-instagram', label: 'Instagram', hoverBg: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30' },
                  { href: 'https://wa.me/+919473228888', icon: 'fab fa-whatsapp', label: 'WhatsApp', hoverBg: 'hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30' },
                  { href: 'https://github.com/rotibankbettiah/roti-bank-bettiah', icon: 'fab fa-github', label: 'GitHub', hoverBg: 'hover:bg-white/10 hover:text-white hover:border-white/20' },
                ].map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center text-slate-500 transition-all duration-300 ${social.hoverBg}`} aria-label={social.label}>
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2 justify-center md:justify-start">
                <div className="w-6 h-0.5 bg-emerald-500 rounded-full"></div>
                Quick Links
              </h4>
              <nav className="flex flex-col gap-3 text-slate-400 text-sm" aria-label="Footer navigation">
                {[
                  { href: '#about', text: 'Our Mission', icon: 'fa-heart' },
                  { href: 'https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog', text: 'Volunteer with Us', icon: 'fa-hands-helping', external: true },
                  { href: '#branches', text: 'Find a Branch', icon: 'fa-map-location-dot' },
                  { href: '#internship', text: 'Career Opportunities', icon: 'fa-graduation-cap' },
                  { href: '#gallery', text: 'Media Gallery', icon: 'fa-images' },
                  { href: '#donation', text: 'Donate Now', icon: 'fa-hand-holding-heart' },
                ].map((link) => (
                  <a 
                    key={link.text} 
                    href={link.href} 
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-3 hover:text-white transition-colors justify-center md:justify-start"
                  >
                    <i className={`fas ${link.icon} text-[10px] text-slate-600 group-hover:text-emerald-500 transition-colors w-4`}></i>
                    <span>{link.text}</span>
                    <i className="fas fa-chevron-right text-[8px] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500"></i>
                  </a>
                ))}
                <button onClick={() => navigateTo('privacy')} className="group flex items-center gap-3 hover:text-white transition-colors justify-center md:justify-start text-left cursor-pointer">
                  <i className="fas fa-shield-halved text-[10px] text-slate-600 group-hover:text-emerald-500 transition-colors w-4"></i>
                  <span>Privacy Policy</span>
                  <i className="fas fa-chevron-right text-[8px] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500"></i>
                </button>
                <button onClick={() => navigateTo('terms')} className="group flex items-center gap-3 hover:text-white transition-colors justify-center md:justify-start text-left cursor-pointer">
                  <i className="fas fa-file-contract text-[10px] text-slate-600 group-hover:text-emerald-500 transition-colors w-4"></i>
                  <span>Terms &amp; Conditions</span>
                  <i className="fas fa-chevron-right text-[8px] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500"></i>
                </button>
              </nav>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2 justify-center md:justify-start">
                <div className="w-6 h-0.5 bg-emerald-500 rounded-full"></div>
                Contact Us
              </h4>
              <div className="text-slate-400 space-y-4 text-sm">
                <a href="tel:+919473228888" className="flex items-center gap-4 justify-center md:justify-start hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <i className="fas fa-phone-alt text-emerald-500 text-xs"></i>
                  </div>
                  +91 9473228888
                </a>
                <a href="mailto:rotibankbettiah@gmail.com" className="flex items-center gap-4 justify-center md:justify-start hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <i className="fas fa-envelope text-emerald-500 text-xs"></i>
                  </div>
                  rotibankbettiah@gmail.com
                </a>
                <div className="flex items-start gap-4 justify-center md:justify-start leading-relaxed">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-map-marker-alt text-emerald-500 text-xs"></i>
                  </div>
                  Kalibag Chowk, Bettiah, Bihar - 845438
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  { icon: 'fa-lock', text: 'Razorpay Secured' },
                  { icon: 'fa-shield-halved', text: '256-bit SSL' },
                ].map((badge, i) => (
                  <span key={i} className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-white/[0.06] px-2.5 py-1.5 rounded-lg border border-white/[0.08]">
                    <i className={`fas ${badge.icon} text-emerald-500`}></i>
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2 justify-center md:justify-start">
                <div className="w-6 h-0.5 bg-emerald-500 rounded-full"></div>
                Stay Updated
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Subscribe to our newsletter to see how your contributions are making a difference.
              </p>
              <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <div className="relative">
                  <i className="fas fa-envelope text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 text-xs"></i>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm w-full" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={subStatus === 'loading'}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl px-4 py-3 font-bold text-sm transition-all shadow-lg shadow-emerald-700/20 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] donate-btn-shimmer"
                >
                  {subStatus === 'loading' ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Subscribing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Subscribe
                    </>
                  )}
                </button>
              </form>
              {subMessage && (
                <div className={`text-xs mt-2 px-4 py-2.5 rounded-xl border font-medium ${
                  subStatus === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' 
                    : 'bg-red-950/40 border-red-900 text-red-400'
                }`}>
                  <i className={`fas ${subStatus === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                  {subMessage}
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/30"></div>
              <i className="fas fa-heart text-emerald-500 text-[10px] animate-heartbeat"></i>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-500/30"></div>
            </div>
            <p className="text-slate-400 text-xs font-medium">© 2025 Roti Bank Bettiah Trust | Serving with Compassion</p>
            <p className="text-slate-500 text-[11px] font-medium tracking-wide">Registration Number: 5071/2023 | Registered NGO &amp; Charitable Trust</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
              <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <span className="text-slate-600">•</span>
              <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer">
                Terms &amp; Conditions
              </button>
              <span className="text-slate-600">•</span>
              <a href="mailto:rotibankbettiah@gmail.com" className="hover:text-emerald-400 transition-colors">
                rotibankbettiah@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <FloatingDonateButton onDonateClick={scrollToDonation} />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
};

export default App;
