import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../common/CustomTooltip';

export function WeeklyChart({ data }) {
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart  data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bjork-border)" vertical={false} />
        <XAxis dataKey="categoria" stroke="var(--bjork-text-soft)" fontSize={10} angle={-20} textAnchor="end" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--bjork-text-soft)" fontSize={12} tickLine={false} axisLine={false} />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Area 
          type="monotone" 
          dataKey="total" 
          name="Siniestros" 
          stroke="var(--bjork-accent)" 
          fill="var(--bjork-accent-soft)" 
          strokeWidth={2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}