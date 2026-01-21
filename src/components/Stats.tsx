
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Meals Served', value: 500000, color: '#10b981' },
  { name: 'Volunteers', value: 1200, color: '#059669' },
  { name: 'Active Cities', value: 5, color: '#047857' },
  { name: 'Donors', value: 3500, color: '#065f46' },
];

const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Our Growing Impact</h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">Real numbers reflecting the collective power of your compassion.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Chart Container - Height reduced to save space on laptop screens */}
          <div className="h-[300px] w-full bg-slate-50 rounded-2xl p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {data.map((item) => (
              <div key={item.name} className="bg-slate-50/50 border border-slate-100 p-6 md:p-8 rounded-3xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{item.name}</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.value.toLocaleString()}+
                </p>
                <div className="mt-4 h-1 w-8 rounded-full transition-all group-hover:w-16" style={{backgroundColor: item.color}}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
