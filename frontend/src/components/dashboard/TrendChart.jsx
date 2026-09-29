import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CustomTooltip } from '../common/CustomTooltip';

export function TrendChart({ data }) {
  const { isDark } = useTheme();
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart key={isDark ? 'dark' : 'light'} data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} vertical={false} />
        <XAxis dataKey="categoria" stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Line 
          type="monotone" 
          dataKey="total" 
          name="Siniestros" 
          stroke={isDark ? '#30d158' : '#059669'} 
          strokeWidth={3} 
          dot={{ r: 4, fill: isDark ? '#30d158' : '#059669' }} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}