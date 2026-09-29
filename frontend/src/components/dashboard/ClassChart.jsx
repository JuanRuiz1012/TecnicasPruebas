import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CustomTooltip } from '../common/CustomTooltip';

export function ClassChart({ data }) {
  const { isDark } = useTheme();
  const chartData = data || [];

  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart key={isDark ? 'dark' : 'light'}data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} vertical={false} />
        <XAxis 
          dataKey="categoria" 
          stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          angle={-20}
          textAnchor="end"
        />
        <YAxis 
          stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-class-${index}`} fill={isDark ? '#ff375f' : '#e11d48'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}