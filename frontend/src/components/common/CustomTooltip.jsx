import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export function CustomTooltip({ active, payload, label }) {
  const { isDark } = useTheme();

  if (active && payload && payload.length) {
    return (
      <div className={`p-3.5 rounded-xl shadow-xl border text-xs min-w-[180px] backdrop-blur-md transition-all ${isDark
          ? 'bg-slate-900/95 border-slate-700 text-white shadow-black/60'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}>
        <div className="font-bold text-sm mb-2 pb-1.5 border-b border-black/10 dark:border-white/10 text-primary tracking-wide">
          {label}
        </div>

        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color || entry.fill || '#6366f1' }}
                />
                <span className="opacity-75 font-medium">{entry.name || 'Valor'}:</span>
              </div>
              <span className="font-bold text-sm">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}