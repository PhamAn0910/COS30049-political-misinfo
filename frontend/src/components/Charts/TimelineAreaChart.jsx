// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Area chart illustrating temporal diffusion volume with interactive brush zoom window
// Key Interface/Contract: Accepts `{ data }` array; renders Recharts `<AreaChart>` with `<Brush>` controls

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from 'recharts';

export default function TimelineAreaChart({ data = [] }) {
  const sampleTimeline = [
    { hour: '0h', misinfo: 120, factual: 40 },
    { hour: '4h', misinfo: 350, factual: 80 },
    { hour: '8h', misinfo: 890, factual: 220 },
    { hour: '12h', misinfo: 1400, factual: 600 },
    { hour: '16h', misinfo: 1100, factual: 950 },
    { hour: '20h', misinfo: 600, factual: 1200 },
    { hour: '24h', misinfo: 300, factual: 1100 },
  ];

  const chartData = data.length > 0 ? data : sampleTimeline;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h4 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Temporal Misinformation vs. Fact-Check Volume (24h Timeline)
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="misinfo" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
            <Area type="monotone" dataKey="factual" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            <Brush dataKey="hour" height={20} stroke="#0ea5e9" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
