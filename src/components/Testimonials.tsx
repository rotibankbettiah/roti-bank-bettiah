
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Regular Donor',
    location: 'Patna, Bihar',
    text: 'Roti Bank Bettiah is doing incredible work. Knowing that my small contribution feeds families gives me immense satisfaction. Their transparency and dedication is unmatched.',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Volunteer',
    location: 'Bettiah, Bihar',
    text: 'Volunteering with Roti Bank changed my perspective on life. Seeing the smiles on children\'s faces when they receive a warm meal — that is priceless.',
    avatar: '👩‍🎓',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. Amit Verma',
    role: 'Monthly Supporter',
    location: 'Delhi',
    text: 'I\'ve been supporting Roti Bank for over a year now. Their monthly reports and updates give me confidence that every rupee is going towards feeding the hungry.',
    avatar: '👨‍⚕️',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sunita Devi',
    role: 'Beneficiary',
    location: 'West Champaran',
    text: 'When my family had nothing to eat, Roti Bank was there for us. They not only provided food but also helped my children with education. God bless this organization.',
    avatar: '👩‍👧‍👦',
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
          <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-heart mr-2"></i>What People Say
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 section-title tracking-tight uppercase">
            Voices of Impact
          </h2>
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto">
            Real stories from donors, volunteers, and beneficiaries who make our mission possible.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative h-[320px] md:h-[260px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition duration-700 ease-in-out ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0 z-10'
                    : 'opacity-0 translate-x-12 z-0 pointer-events-none'
                }`}
              >
                <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-emerald-100/50 border border-emerald-100/50 h-full">
                  {/* Quote icon */}
                  <div className="absolute -top-4 left-10">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <i className="fas fa-quote-left text-white text-sm"></i>
                    </div>
                  </div>

                  <p className="text-slate-800 italic leading-relaxed text-sm lg:text-base mb-8">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border-2 border-emerald-100">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{testimonial.name}</h3>
                        <p className="text-emerald-800 text-xs font-bold uppercase tracking-widest">{testimonial.role}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          <i className="fas fa-map-marker-alt mr-1"></i>{testimonial.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <i key={i} className="fas fa-star text-amber-400 text-sm"></i>
                      ))}
                    </div>
                  </div>
                </div>
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
