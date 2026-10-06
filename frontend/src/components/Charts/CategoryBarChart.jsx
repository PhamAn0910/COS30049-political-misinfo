// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Interactive bar chart displaying claim distribution across political and breaking news topics
// Key Interface/Contract: Accepts `{ data }` prop array of `{ category, count }`; renders Recharts `<BarChart>`

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function CategoryBarChart({ data = [] }) {
  const defaultData = [
    { category: 'Ferguson', count: 1143 },
    { category: 'Ottawa Shooting', count: 890 },
    { category: 'Putin Missing', count: 238 },
    { category: 'Charlie Hebdo', count: 1929 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h4 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Claim Distribution by Event Category
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
