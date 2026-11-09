import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CustomTooltip } from '../common/CustomTooltip';

export function GravityChart({ data }) {
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bjork-border)" horizontal={false} />
        <XAxis type="number" stroke="var(--bjork-text-soft)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis dataKey="categoria" type="category" stroke="var(--bjork-text-soft)" fontSize={11} tickLine={false} axisLine={false} width={90} />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bjork-surface-hover)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-grav-${index}`} fill="var(--bjork-accent)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}