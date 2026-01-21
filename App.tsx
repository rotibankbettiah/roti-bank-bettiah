
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Donation from './components/Donation';
import Chatbot from './components/Chatbot';
import { supabaseService, supabase } from './services/supabaseService';
import { Activity, Achievement, Branch, NewsItem, Notice, InternshipContent, Cause } from './types';

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
    banner: string
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
    banner: ''
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideshowInterval = useRef<number | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      const [g, ach, br, act, not, nws, int, cs, ab, bn] = await Promise.all([
        supabaseService.getGalleryImages(),
        supabaseService.getAchievements(),
        supabaseService.getBranches(),
        supabaseService.getActivities(),
        supabaseService.getNotices(),
        supabaseService.getNews(),
        supabaseService.getInternshipContent(),
        supabaseService.getCauses(),
        supabaseService.getAboutContent(),
        supabaseService.getBanner()
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
        banner: bn
      });
    } catch (err) {
      console.error("Data fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    // Enable Real-time updates from Supabase
    // This channel listens for ALL changes across tables to ensure UI reflects database state immediately
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

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="pt-36 lg:pt-48">
        <Hero customBanner={data.banner} />
        
        {/* Stats Quick View */}
        <div id="stats-section" className="relative z-20 -mt-8 container mx-auto px-6">
          <Stats />
        </div>

        {/* Gallery Slideshow Section */}
        <section id="gallery" className="py-24 bg-white overflow-hidden scroll-mt-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 section-title tracking-tight uppercase">Impact Gallery</h2>
            <p className="text-slate-500 mb-12 max-w-2xl mx-auto italic">Hover over photos to pause and view our mission in detail.</p>
            
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
                    alt={item.title} 
                    className="relative z-10 w-full h-full object-contain" 
                  />
                  
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col justify-end p-12 text-left">
                    <h3 className="text-white text-3xl font-black mb-2">{item.title}</h3>
                    <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">{item.caption || 'Field Operations'}</p>
                  </div>
                </div>
              )) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
                  Loading Gallery Content...
                </div>
              )}

              <div className="absolute bottom-6 right-12 z-30 flex gap-3">
                {data.gallery.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white'}`}
                  />
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

        {/* About Us Section */}
        <section id="about" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-24">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12 section-title tracking-tight uppercase">About Us</h2>
            <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 mx-auto">
                <i className="fas fa-hand-holding-heart text-3xl"></i>
              </div>
              <p className="text-slate-600 text-xl leading-relaxed font-medium italic">
                "{data.about || "Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free."}"
              </p>
              <div className="mt-12">
                <a href="#donation" className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                  Support Our Mission <i className="fas fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 section-title tracking-tight uppercase">Our Location</h2>
            <div className="flex flex-col items-center bg-slate-50 p-12 rounded-[4rem] border border-slate-100 max-w-3xl mx-auto">
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
              <a href="https://maps.app.goo.gl/iUDm3AZMNMM91PDN6?g_st=aw" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-full font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all">
                <i className="fas fa-map-marked-alt text-emerald-500 group-hover:scale-110 transition-transform"></i>
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-24 bg-slate-900 text-white relative scroll-mt-24">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 section-title tracking-tight uppercase">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {data.achievements.map((ach) => (
                <div key={ach.id} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
                  {ach.imageUrl && <img src={ach.imageUrl} className="w-full h-48 object-cover rounded-[2rem] mb-8 shadow-2xl group-hover:scale-[1.02] transition-transform" alt={ach.description} />}
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:rotate-12 transition-transform">
                    <i className={`fas ${ach.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-4xl font-black mb-2 tracking-tighter">{ach.count}</h3>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">{ach.description}</p>
                  {ach.caption && <p className="text-slate-400 text-sm leading-relaxed">{ach.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Branches Section */}
        <section id="branches" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Our Branches</h2>
            <div className="flex flex-wrap justify-center gap-10">
              {data.branches.map((br) => (
                <div key={br.id} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 card-hover w-full max-w-sm group">
                  <div className="mb-6 overflow-hidden rounded-[2rem]">
                    {br.imageUrl ? (
                      <img src={br.imageUrl} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700" alt={br.name} />
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internship Section */}
        <section id="internship" className="py-24 bg-emerald-900 text-white scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Internship <span className="text-emerald-400">Corner</span></h2>
                <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                  Join our mission as a student intern. Gain real-world social impact experience and help us bridge the gap between food waste and hunger.
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
                <button className="px-12 py-5 bg-white text-emerald-900 rounded-full font-black uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95 shadow-xl">
                  Apply Today
                </button>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                {data.internship.find(i => i.type === 'certificate')?.url && (
                  <img 
                    src={data.internship.find(i => i.type === 'certificate')?.url} 
                    className="relative z-10 w-full rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" 
                    alt="Certificate Sample"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section id="activities" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16 section-title tracking-tight uppercase">Recent Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {data.activities.map((act) => (
                <div key={act.id} className="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 group card-hover">
                  <div className="h-56 overflow-hidden">
                    <img src={act.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={act.title} />
                  </div>
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">{act.title}</h3>
                      {act.caption && <span className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">{act.caption}</span>}
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">{act.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notice & News Split Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div id="notices" className="scroll-mt-32">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-12 tracking-tight flex items-center gap-4">
                <i className="fas fa-bullhorn text-emerald-600"></i> Notice Board
              </h2>
              <div className="space-y-6">
                {data.notices.map((nt) => (
                  <div key={nt.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/50 hover:border-emerald-300 transition-all flex gap-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-slate-400"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{nt.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{nt.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div id="news" className="scroll-mt-32">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-12 tracking-tight flex items-center gap-4">
                <i className="fas fa-newspaper text-emerald-600"></i> Latest News
              </h2>
              <div className="space-y-8">
                {data.news.map((item) => (
                  <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-4 block">{new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                    
                    {item.imageUrl && (
                      <div className="rounded-[1.5rem] overflow-hidden mb-6 bg-slate-100 flex items-center justify-center min-h-[200px] border border-slate-100">
                        <img 
                          src={item.imageUrl} 
                          className="max-w-full max-h-[500px] object-contain transition-transform duration-500" 
                          alt={item.title}
                        />
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Causes Section */}
        <section id="causes" className="py-24 bg-white scroll-mt-24">
          <div className="container mx-auto px-6 max-w-4xl">
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
                        <p className="text-slate-400 text-[10px] font-bold uppercase">{cause.completed} / {cause.target}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left border-b border-white/5 pb-16 mb-12">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-8">
                <img src="download-WeResize.com (1).png" className="h-10 rounded-full" alt="logo" />
                <span className="font-black text-2xl tracking-tighter">Roti Bank Bettiah</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8">
                Eradicating hunger and providing hope to the underprivileged since 2023. Join our journey to make Bettiah hunger-free.
              </p>
              <div className="flex justify-center md:justify-start gap-6 text-2xl">
                <a href="https://www.facebook.com/ROTIBANKBETTIAH" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-all"><i className="fab fa-facebook"></i></a>
                <a href="https://twitter.com/Rotibankbettiah" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-all"><i className="fab fa-twitter"></i></a>
                <a href="https://instagram.com/rotibankbettiah" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-all"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/+919473228888" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-500 transition-all"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Quick Links</h4>
              <nav className="flex flex-col gap-4 text-slate-400 font-medium">
                <a href="#about" className="hover:text-white transition-colors">Our Mission</a>
                <a href="#branches" className="hover:text-white transition-colors">Find a Branch</a>
                <a href="#internship" className="hover:text-white transition-colors">Career Opportunities</a>
                <a href="#gallery" className="hover:text-white transition-colors">Media Gallery</a>
              </nav>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-500">Contact Us</h4>
              <div className="text-slate-400 space-y-4">
                <p className="flex items-center gap-4 justify-center md:justify-start"><i className="fas fa-phone-alt text-emerald-500"></i> +91 9473228888</p>
                <p className="flex items-center gap-4 justify-center md:justify-start"><i className="fas fa-envelope text-emerald-500"></i> rotibankbettiah@gmail.com</p>
                <p className="flex items-start gap-4 justify-center md:justify-start leading-relaxed"><i className="fas fa-map-marker-alt text-emerald-500 mt-1"></i> Kalibag Chowk, Bettiah, Bihar - 845438</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black mb-2">© 2024 Roti Bank Bettiah | Serving with Compassion</p>
            <p className="text-slate-600 text-[9px] uppercase font-bold">Registration Number: 5071/2023 | ISO Certified NGO</p>
          </div>
        </div>
      </footer>
      
      <Chatbot />
    </div>
  );
};

export default App;
