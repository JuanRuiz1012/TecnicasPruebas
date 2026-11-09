import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CustomTooltip } from '../common/CustomTooltip';

export function ClassChart({ data }) {
  const chartData = data || [];

  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bjork-border)" vertical={false} />
        <XAxis 
          dataKey="categoria" 
          stroke="var(--bjork-text-soft)" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          angle={-20}
          textAnchor="end"
        />
        <YAxis 
          stroke="var(--bjork-text-soft)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bjork-surface-hover)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-class-${index}`} fill="var(--bjork-accent)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}