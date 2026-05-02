'use client';

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BackboneChart({ data }: { data: any[] }) {
  return (
    <div className="h-56 w-full bg-white/5 rounded-[2.5rem] p-6 border border-white/5 mb-8">
      <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] block mb-4">Vitality & Pest Trend (7-Day Projection)</span>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8F53E" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#C8F53E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ background: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
            itemStyle={{ color: '#C8F53E' }}
          />
          <Area type="monotone" dataKey="vitality" stroke="#C8F53E" strokeWidth={3} fillOpacity={1} fill="url(#colorVit)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
