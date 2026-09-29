
import React, { useState, useEffect } from 'react';
import { Tilt3DCard } from './ScrollAnimations';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Regular Donor',
    location: 'Patna, Bihar',
    text: 'Roti Bank Bettiah is doing incredible work. Knowing that my contribution feeds families directly gives me immense satisfaction. Their transparency and dedication is unmatched.',
    initials: 'RK',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Volunteer',
    location: 'Bettiah, Bihar',
    text: 'Volunteering with Roti Bank changed my perspective on life. Seeing the relief on people\'s faces when they receive a warm, fresh meal, that is priceless.',
    initials: 'PS',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. Amit Verma',
    role: 'Monthly Supporter',
    location: 'Delhi',
    text: 'I have been supporting Roti Bank for over two years. Their monthly reports and photo updates give me absolute confidence that every rupee is going towards feeding the hungry.',
    initials: 'AV',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sunita Devi',
    role: 'Community Member',
    location: 'West Champaran',
    text: 'When our family had nothing to eat during medical treatment at MJK Hospital, Roti Bank was there for us every single evening. God bless this dedicated team.',
    initials: 'SD',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden scroll-mt-24">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -mr-48 -mb-48"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] mb-4 border border-emerald-200">
            <i className="fas fa-heart mr-2 text-emerald-600"></i>Community Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 section-title tracking-tight uppercase">
            Voices of Impact
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Real stories from donors, volunteers, and supporters who power our daily seva.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          <div className="relative min-h-[380px] sm:min-h-[290px] md:min-h-[260px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition duration-700 ease-in-out ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0 z-10 pointer-events-auto visible'
                    : 'opacity-0 translate-x-8 z-0 pointer-events-none invisible'
                }`}
                aria-hidden={index !== activeIndex}
              >
                <Tilt3DCard maxTilt={8} glare={true} className="h-full">
                  <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200/80 h-full relative flex flex-col justify-between">
                    {/* Quote icon */}
                    <div className="absolute -top-4 left-6 sm:left-8">
                      <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-600/30">
                        <i className="fas fa-quote-left text-white text-xs"></i>
                      </div>
                    </div>

                    <p className="text-slate-700 italic leading-relaxed text-sm lg:text-base mb-8">
                      &quot;{testimonial.text}&quot;
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-800 font-bold rounded-xl flex items-center justify-center text-sm border border-emerald-200/70">
                          {testimonial.initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{testimonial.name}</h3>
                          <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">{testimonial.role}</p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            <i className="fas fa-location-dot mr-1"></i>{testimonial.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <i key={i} className="fas fa-star text-amber-400 text-xs"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="p-5 -m-5 group"
                aria-label={`View testimonial ${idx + 1}`}
              >
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-10 bg-emerald-600'
                      : 'w-2.5 bg-emerald-200 group-hover:bg-emerald-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
