import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CustomTooltip } from '../common/CustomTooltip';

export function CityChart({ data }) {
  const { isDark } = useTheme();
  const chartData = data || [];

  const axisStyle = {
    fill: isDark ? '#cbd5e1' : '#475569',
    fontSize: 12
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Añadimos la prop key aquí para forzar el re-montaje al cambiar de tema */}
      <BarChart key={isDark ? 'dark' : 'light'} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 
          vertical={false} 
        />
        
        <XAxis 
          dataKey="categoria" 
          stroke={isDark ? 'rgba(235,235,245,0.4)' : '#cbd5e1'} 
          tick={axisStyle} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke={isDark ? 'rgba(235,235,245,0.4)' : '#cbd5e1'} 
          tick={axisStyle} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value / 1000}k`} 
        />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={isDark ? '#0a84ff' : '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}