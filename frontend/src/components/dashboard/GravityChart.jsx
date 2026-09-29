import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CustomTooltip } from '../common/CustomTooltip';

export function GravityChart({ data }) {
  const { isDark } = useTheme();
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart key={isDark ? 'dark' : 'light'}layout="vertical" data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} horizontal={false} />
        <XAxis type="number" stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis dataKey="categoria" type="category" stroke={isDark ? 'rgba(235,235,245,0.6)' : '#64748b'} fontSize={11} tickLine={false} axisLine={false} width={90} />
        
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
        
        <Bar dataKey="total" name="Siniestros" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-grav-${index}`} fill={isDark ? '#38bdf8' : '#0ea5e9'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}