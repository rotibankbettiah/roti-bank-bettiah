
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Donation from './components/Donation';
import Chatbot from './components/Chatbot';
import Testimonials from './components/Testimonials';
import FloatingDonateButton from './components/FloatingDonateButton';
import MediaCenter from './components/MediaCenter';
import { supabaseService, supabase } from './services/supabaseService';
import {
  Activity,
  Achievement,
  Branch,
  NewsItem,
  Notice,
  InternshipContent,
  Cause,
  MediaItem
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
    media: MediaItem[]
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
    media: []
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideshowInterval = useRef<number | null>(null);

  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');

  const fetchAllData = useCallback(async () => {
    try {
      const [g, ach, br, act, not, nws, int, cs, ab, bn, md] = await Promise.all([
        supabaseService.getGalleryImages(),
        supabaseService.getAchievements(),
        supabaseService.getBranches(),
        supabaseService.getActivities(),
        supabaseService.getNotices(),
        supabaseService.getNews(),
        supabaseService.getInternshipContent(),
        supabaseService.getCauses(),
        supabaseService.getAboutContent(),
        supabaseService.getBanner(),
        supabaseService.getMediaItems()
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
        media: md
      });
    } catch (err) {
      console.error("Data fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const channel = supabase
      .channel('supabase-realtime-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.debug('Supabase Update Received:', payload.eventType, payload.table);
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar news={data.news} />
      
      <main className="pt-28 lg:pt-36">
        <Hero customBanner={data.banner} />
        
        {/* Stats Quick View */}
        <div id="stats-section" className="relative z-20 -mt-8 container mx-auto px-6">
          <Stats />
        </div>

        {/* Gallery Slideshow Section */}
        <section id="gallery" className="py-24 bg-white overflow-hidden scroll-mt-24 reveal">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <i className="fas fa-camera mr-2"></i>Visual Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 section-title tracking-tight uppercase">Impact Gallery</h2>
            <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Hover over photos to pause and view our mission in detail.</p>
            
            <div 
              className="relative max-w-5xl mx-auto h-[400px] md:h-[600px] rounded-[3rem] shadow-2xl overflow-hidden group cursor-pointer border-8 border-slate-50 bg-slate-900"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {data.gallery.length > 0 ? data.gallery.map((item, index) => (
                <div 
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  ></div>
                  
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || 'Gallery image'} 
                    className="relative z-10 w-full h-full object-contain"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 text-left">
                    {item.title ? (
                      <h3 className="text-white text-2xl md:text-3xl font-black mb-2">{item.title}</h3>
                    ) : (
                      <h3 className="sr-only">Gallery Image</h3>
                    )}
                    <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">{item.caption || 'Field Operations'}</p>
                  </div>
                </div>
              )) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
                  <div className="text-center">
                    <i className="fas fa-images text-4xl text-slate-400 mb-4 block"></i>
                    Loading Gallery Content...
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 right-8 md:right-12 z-30 flex gap-3">
                {data.gallery.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className="p-2 -m-2 group"
                    aria-label={`View slide ${idx + 1}`}
                  >
                    <div className={`h-2 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-white/50 group-hover:bg-white'}`} />
                  </button>
                ))}
              </div>

              {isPaused && (
                <div className="absolute top-8 right-8 z-30 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <i className="fas fa-pause"></i> Paused
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Media Center Section */}
        <MediaCenter items={data.media} />

        {/* About Us Section */}
        <section id="about" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-24 reveal">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-info-circle mr-2"></i>Who We Are
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12 section-title tracking-tight uppercase">About Us</h2>
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl shadow-emerald-100/30 border border-emerald-50/50 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 mx-auto">
                <i className="fas fa-hand-holding-heart text-3xl"></i>
              </div>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium italic">
                "{data.about || "Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free."}"
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#donation" className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 donate-btn-shimmer">
                  Support Our Mission <i className="fas fa-arrow-right text-xs"></i>
                </a>
                <a href="#achievements" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-700 rounded-full font-bold border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                  Our Achievements <i className="fas fa-trophy text-xs text-emerald-500"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Donate Section */}
        <section className="py-24 bg-white overflow-hidden reveal">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-block px-5 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <i className="fas fa-lightbulb mr-2"></i>Why It Matters
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 section-title tracking-tight uppercase">Why Donate?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div key={i} className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 card-hover group text-center glow-card-emerald">
                  <div className={`w-16 h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <i className={`fas ${item.icon} text-${item.color}-600 text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-24 bg-slate-50 scroll-mt-24 reveal">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block px-5 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <i className="fas fa-map-pin mr-2"></i>Visit Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 section-title tracking-tight uppercase">Our Location</h2>
            <div className="flex flex-col items-center bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 max-w-3xl mx-auto shadow-xl shadow-slate-100/50">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <svg className="map-pin w-20 h-20 text-red-500 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.056 4.944A7.447 7.447 0 0110 2.5c4.142 0 7.5 3.358 7.5 7.5a7.447 7.447 0 01-2.444 5.056L10 20l-5.056-5.056A7.447 7.447 0 012.5 10c0-4.142 3.358-7.5 7.5-7.5zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-4 leading-tight">Visit Our Center</p>
              <p className="text-slate-500 mb-10 max-w-lg leading-relaxed">
                Kalibag Chowk, Bettiah, West Champaran, Bihar, 845438. Open daily for food distribution and aid.
              </p>
              <a href="https://maps.app.goo.gl/iUDm3AZMNMM91PDN6?g_st=aw" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-full font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm">
                <i className="fas fa-map-marked-alt text-emerald-500 group-hover:scale-110 transition-transform"></i>
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-24 bg-slate-900 text-white relative scroll-mt-24 reveal">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-white/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-medal mr-2"></i>Milestones
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 section-title tracking-tight uppercase">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {data.achievements.map((ach) => (
                <article key={ach.id} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
                  {ach.imageUrl && (
                    <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] mb-8 shadow-2xl border-4 border-white/10">
                      <img 
                        src={ach.imageUrl} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={ach.description || 'Achievement image'}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:rotate-12 transition-transform">
                    <i className={`fas ${ach.icon} text-2xl`}></i>
                  </div>
                  {ach.count ? (
                    <h3 className="text-4xl font-black mb-2 tracking-tighter">{ach.count}</h3>
                  ) : (
                    <h3 className="sr-only">Achievement Metric</h3>
                  )}
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">{ach.description}</p>
                  {ach.caption && <p className="text-slate-400 text-sm leading-relaxed">{ach.caption}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Our Branches Section */}
        <section id="branches" className="py-24 bg-white scroll-mt-24 reveal">
          <div className="container mx-auto px-6">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-map-location-dot mr-2"></i>Nationwide Network
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Our Branches</h2>
            <div className="flex flex-wrap justify-center gap-10">
              {data.branches.map((br) => (
                <article key={br.id} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 card-hover w-full max-w-sm group">
                  <div className="mb-6 overflow-hidden rounded-[2rem]">
                    {br.imageUrl ? (
                      <img src={br.imageUrl} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700" alt={br.name || 'Branch image'} loading="lazy" />
                    ) : (
                      <div className="w-full h-44 bg-slate-200 flex items-center justify-center text-slate-400">
                        <i className="fas fa-building text-4xl"></i>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{br.name}</h3>
                  <p className="text-slate-500 font-medium mb-6 uppercase tracking-widest text-xs">{br.location}</p>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full"></span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Internship Section */}
        <section id="internship" className="py-24 bg-emerald-900 text-white scroll-mt-24 reveal">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div>
                <span className="inline-block px-5 py-2 bg-white/10 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <i className="fas fa-user-graduate mr-2"></i>Join Us
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Internship <span className="text-emerald-400">& Volunteering</span></h2>
                <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                  Join our mission as a volunteer or student intern. Gain real-world social impact experience and help us bridge the gap between food waste and hunger.
                </p>
                <div className="space-y-6 mb-12">
                  {data.internship.map((item) => (
                    <div key={item.id} className="flex gap-5 items-start">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-400">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      {item.type === 'criteria' && <p className="text-white/90 font-medium">{item.content}</p>}
                      {item.type === 'certificate' && <p className="text-white/90 font-medium">Earn recognized certifications for your contribution.</p>}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScXUtdd9WqgGERF8iDaZrDslw10lidmvpyhyY8EtFQwIvdgBQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white text-emerald-900 rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-50 transition-all active:scale-95 shadow-xl text-center">
                    Apply as Intern
                  </a>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSfzN4WcusmcUmAKrpnpf4J8128O37tf7MpuJ_P96uKmX-sKsg/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-emerald-800 text-white border-2 border-emerald-700 rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all active:scale-95 text-center">
                    Volunteer
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                {data.internship.find(i => i.type === 'certificate')?.url && (
                  <img 
                    src={data.internship.find(i => i.type === 'certificate')?.url} 
                    className="relative z-10 w-full rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" 
                    alt="Roti Bank Bettiah Internship Certificate Sample"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section id="activities" className="py-24 bg-white scroll-mt-24 reveal">
          <div className="container mx-auto px-6 max-w-5xl">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-calendar-check mr-2"></i>Field Work
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Recent Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {data.activities.map((act) => (
                <article key={act.id} className="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 group card-hover">
                  <div className="h-56 overflow-hidden">
                    <img src={act.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={act.title || 'Activity image'} loading="lazy" />
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{act.title}</h3>
                      {act.caption && <span className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest flex-shrink-0 ml-3">{act.caption}</span>}
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">{act.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Notice & News Split Section */}
        <section className="py-24 bg-slate-50 reveal">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div id="notices" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-bullhorn text-emerald-600"></i>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notice Board</h2>
              </div>
              <div className="space-y-6">
                {data.notices.map((nt) => (
                  <article key={nt.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/50 hover:border-emerald-300 hover:shadow-lg transition-all flex gap-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-slate-400"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{nt.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{nt.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            
            <div id="news" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-newspaper text-emerald-600"></i>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Latest News</h2>
              </div>
              <div className="space-y-8">
                {data.news.filter(item => !item.is_headline).map((item) => (
                  <article key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-4 block">{new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                    
                    {item.imageUrl && (
                      <div className="rounded-[1.5rem] overflow-hidden mb-6 bg-slate-100 flex items-center justify-center min-h-[200px] border border-slate-100">
                        <img 
                          src={item.imageUrl} 
                          className="max-w-full max-h-[500px] object-contain transition-transform duration-500" 
                          alt={item.title || 'News image'}
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.content}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Causes Section */}
        <section id="causes" className="py-24 bg-white scroll-mt-24 reveal">
          <div className="container mx-auto px-6 max-w-4xl">
            <span className="block text-center mb-6">
              <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fas fa-bullseye mr-2"></i>Progress Tracker
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Ongoing Goals</h2>
            <div className="space-y-16">
              {data.causes.map((cause) => {
                const progress = Math.min((cause.completed / cause.target) * 100, 100);
                return (
                  <div key={cause.id} className="space-y-5">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900">{cause.name}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Target Impact Progress</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-600">{Math.round(progress)}%</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase">{cause.completed.toLocaleString('en-IN')} / {cause.target.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-5 shadow-inner overflow-hidden border border-slate-200">
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

        <Donation />
      </main>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-center md:text-left border-b border-white/5 pb-16 mb-12">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-8">
                <img src="/logo.png" width={40} height={40} className="h-10 rounded-full" alt="Roti Bank Bettiah logo" />
                <span className="font-black text-2xl tracking-tighter">Roti Bank Bettiah Trust</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8">
                Roti Bank Bettiah Trust is a registered non-profit NGO and charitable trust. Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free.
              </p>
              <div className="flex justify-center md:justify-start gap-4 text-xl">
                {[
                  { href: 'https://www.facebook.com/ROTIBANKBETTIAH', icon: 'fab fa-facebook', label: 'Facebook' },
                  { href: 'https://twitter.com/Rotibankbettiah', icon: 'fab fa-twitter', label: 'Twitter' },
                  { href: 'https://instagram.com/rotibankbettiah', icon: 'fab fa-instagram', label: 'Instagram' },
                  { href: 'https://wa.me/+919473228888', icon: 'fab fa-whatsapp', label: 'WhatsApp' },
                  { href: 'https://github.com/rotibankbettiah/roti-bank-bettiah', icon: 'fab fa-github', label: 'GitHub' },
                ].map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white/10 transition-all" aria-label={social.label}>
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Quick Links</h4>
              <nav className="flex flex-col gap-4 text-slate-400 font-medium" aria-label="Footer navigation">
                <a href="#about" className="hover:text-white transition-colors">Our Mission</a>
                <a href="#branches" className="hover:text-white transition-colors">Find a Branch</a>
                <a href="#internship" className="hover:text-white transition-colors">Career Opportunities</a>
                <a href="#gallery" className="hover:text-white transition-colors">Media Gallery</a>
                <a href="#donation" className="hover:text-white transition-colors">Donate Now</a>
              </nav>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Contact Us</h4>
              <div className="text-slate-400 space-y-4">
                <p className="flex items-center gap-4 justify-center md:justify-start"><i className="fas fa-phone-alt text-emerald-500"></i> +91 9473228888</p>
                <p className="flex items-center gap-4 justify-center md:justify-start"><i className="fas fa-envelope text-emerald-500"></i> rotibankbettiah@gmail.com</p>
                <p className="flex items-start gap-4 justify-center md:justify-start leading-relaxed"><i className="fas fa-map-marker-alt text-emerald-500 mt-1"></i> Kalibag Chowk, Bettiah, Bihar - 845438</p>
              </div>

              {/* Razorpay Trust Badge */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                  <i className="fas fa-lock text-emerald-500"></i>
                  Payments Secured by Razorpay
                </p>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Stay Updated</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Subscribe to our newsletter to see how your contributions are making a difference.
              </p>
              <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm w-full" 
                />
                <button 
                  type="submit" 
                  disabled={subStatus === 'loading'}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-4 py-3 font-bold text-sm transition-colors shadow-lg shadow-emerald-700/20 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className={`text-xs mt-2 px-4 py-2.5 rounded-lg border font-medium ${
                  subStatus === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' 
                    : 'bg-red-950/40 border-red-900 text-red-400'
                }`}>
                  {subMessage}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black mb-2">© 2025 Roti Bank Bettiah Trust | Serving with Compassion</p>
            <p className="text-slate-400 text-[9px] uppercase font-bold">Registration Number: 5071/2023 | Registered NGO & Charitable Trust</p>
          </div>
        </div>
      </footer>
      
      <FloatingDonateButton onDonateClick={scrollToDonation} />
      <Chatbot />
    </div>
  );
};

export default App;
