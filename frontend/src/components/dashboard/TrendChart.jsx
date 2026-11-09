import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../common/CustomTooltip';

export function TrendChart({ data }) {
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart  data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--bjork-border)" vertical={false} />
        <XAxis dataKey="categoria" stroke="var(--bjork-text-soft)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--bjork-text-soft)" fontSize={12} tickLine={false} axisLine={false} />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Line 
          type="monotone" 
          dataKey="total" 
          name="Siniestros" 
          stroke="var(--bjork-accent)" 
          strokeWidth={3} 
          dot={{ r: 4, fill: 'var(--bjork-accent)' }} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}