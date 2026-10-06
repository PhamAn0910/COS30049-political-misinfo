// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Scatter/Bubble chart mapping rumor probability against cascade spread velocity
// Key Interface/Contract: Accepts `{ data }` array; renders Recharts `<ScatterChart>` with Z-axis bubble sizing

import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid } from 'recharts';

export default function CascadeBubbleChart({ data = [] }) {
  const sampleData = [
    { probability: 0.85, velocity: 42, reach: 5000, event: 'Ferguson' },
    { probability: 0.15, velocity: 12, reach: 1200, event: 'Ferguson' },
    { probability: 0.92, velocity: 65, reach: 8500, event: 'Ottawa' },
    { probability: 0.30, velocity: 8, reach: 600, event: 'Putin' },
    { probability: 0.78, velocity: 34, reach: 3200, event: 'Charlie Hebdo' },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h4 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Cascade Velocity vs. Rumor Probability
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" dataKey="probability" name="Rumor Probability" domain={[0, 1]} tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="velocity" name="Retweets/Hour" tick={{ fontSize: 11 }} />
            <ZAxis type="number" dataKey="reach" range={[50, 400]} name="Total Reach" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Cascades" data={chartData} fill="#ef4444" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
