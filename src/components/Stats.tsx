import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Meals Served', value: 500000, color: '#10b981', icon: 'fa-utensils' },
  { name: 'Volunteers', value: 1200, color: '#059669', icon: 'fa-users' },
  { name: 'Active Cities', value: 5, color: '#047857', icon: 'fa-city' },
  { name: 'Donors', value: 3500, color: '#065f46', icon: 'fa-hand-holding-heart' },
];

const financeData = [
  { name: 'Food & Distribution', value: 85, color: '#059669' },
  { name: 'Logistics', value: 10, color: '#10b981' },
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
    <section ref={sectionRef} id="stats" className="py-12 bg-white rounded-[3rem] shadow-xl shadow-emerald-100/30 border border-emerald-50/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <i className="fas fa-chart-line mr-1"></i> Live Statistics
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Our Growing Impact</h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Real numbers reflecting the collective power of your compassion.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Chart - Added minHeight to fix Recharts width/height console warning */}
          <div className="h-[300px] w-full bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-4 shadow-inner border border-slate-100">
            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                  formatter={(value: number) => [value.toLocaleString('en-IN'), '']}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stat Cards with animated counters */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {data.map((item, index) => (
              <div 
                key={item.name} 
                className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group glow-card-emerald"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}15` }}>
                  <i className={`fas ${item.icon}`} style={{ color: item.color }}></i>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{item.name}</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  <AnimatedCounter target={item.value} isVisible={isVisible} />+
                </p>
                <div className="mt-4 h-1 w-8 rounded-full transition-all duration-500 group-hover:w-16" style={{backgroundColor: item.color}}></div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100 mb-16" />

        {/* Financial Transparency Section (New Premium NGO Feature) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <i className="fas fa-shield-halved mr-1"></i> Financial Transparency
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">100% Transparent Operation</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              As a registered non-profit organization, we believe that transparency builds trust. We ensure that every donation you make is utilized with maximum efficiency.
            </p>
            <ul className="space-y-4">
              {financeData.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
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
