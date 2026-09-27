import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Tilt3DCard } from './ScrollAnimations';

const data = [
  { name: 'Meals Served', value: 50000, color: '#059669', icon: 'fa-utensils' },
  { name: 'Volunteers', value: 120, color: '#0284c7', icon: 'fa-users' },
  { name: 'Active Cities', value: 4, color: '#0d9488', icon: 'fa-city' },
  { name: 'Donors', value: 850, color: '#d97706', icon: 'fa-hand-holding-heart' },
];

const financeData = [
  { name: 'Food & Distribution', value: 85, color: '#059669' },
  { name: 'Logistics', value: 10, color: '#0d9488' },
  { name: 'Admin & Tech', value: 5, color: '#6ee7b7' },
];

const AnimatedCounter: React.FC<{ target: number; isVisible: boolean; duration?: number }> = ({ target, isVisible, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <>{count.toLocaleString('en-IN')}</>;
};

const Stats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="py-12 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] mb-4 border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Statistics
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">Our Growing Impact</h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Real numbers reflecting daily food relief operations across West Champaran.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Chart */}
          <div className="h-[300px] w-full bg-gradient-to-br from-slate-50 to-emerald-50/20 rounded-2xl p-4 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '600'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(5, 150, 105, 0.05)'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)', fontSize: '12px', fontWeight: 'bold'}}
                  formatter={(value: number) => [value.toLocaleString('en-IN'), '']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stat Cards with animated counters & 3D tilt */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {data.map((item, index) => (
              <Tilt3DCard key={item.name} maxTilt={10} glare={true} className="h-full">
                <motion.div 
                  className="bg-white border border-slate-200/80 p-6 md:p-7 rounded-xl hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
                      <i className={`fas ${item.icon} text-sm`} style={{ color: item.color }}></i>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5">{item.name}</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      <AnimatedCounter target={item.value} isVisible={isVisible} />+
                    </p>
                    <div className="mt-3 h-1 w-8 rounded-full transition-all duration-300 group-hover:w-14" style={{backgroundColor: item.color}}></div>
                  </div>
                </motion.div>
              </Tilt3DCard>
            ))}
          </div>
        </div>

        <hr className="border-slate-100 mb-16" />

        {/* Financial Transparency Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] mb-4 border border-slate-200">
              <i className="fas fa-shield-halved text-emerald-600"></i> Financial Transparency

            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">100% Transparent Operation</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              As a registered non-profit organization, we believe that transparency builds trust. We ensure that every donation you make is utilized with maximum efficiency.
            </p>
            <ul className="space-y-4">
              {financeData.map((item) => (
                <li key={item.name} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-lg" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
              <PieChart>
                <Pie
                  data={financeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {financeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
