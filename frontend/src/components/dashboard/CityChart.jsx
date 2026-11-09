import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CustomTooltip } from '../common/CustomTooltip';

export function CityChart({ data }) {
  const chartData = data || [];

  const axisStyle = {
    fill: 'var(--bjork-text-muted)',
    fontSize: 12
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Añadimos la prop key aquí para forzar el re-montaje al cambiar de tema */}
      <BarChart  data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="var(--bjork-border)" 
          vertical={false} 
        />
        
        <XAxis 
          dataKey="categoria" 
          stroke="var(--bjork-text-soft)" 
          tick={axisStyle} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="var(--bjork-text-soft)" 
          tick={axisStyle} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value / 1000}k`} 
        />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bjork-surface-hover)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="var(--bjork-accent)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}