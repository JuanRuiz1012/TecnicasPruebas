import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CustomTooltip } from '../common/CustomTooltip';

export function WeeklyChart({ data }) {
  const { isDark } = useTheme();
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart key={isDark ? 'dark' : 'light'} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} vertical={false} />
        <XAxis dataKey="categoria" stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={10} angle={-20} textAnchor="end" tickLine={false} axisLine={false} />
        <YAxis stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Area 
          type="monotone" 
          dataKey="total" 
          name="Siniestros" 
          stroke={isDark ? '#bf5af2' : '#9333ea'} 
          fill={isDark ? 'rgba(191,90,242,0.2)' : 'rgba(147,51,234,0.15)'} 
          strokeWidth={2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}