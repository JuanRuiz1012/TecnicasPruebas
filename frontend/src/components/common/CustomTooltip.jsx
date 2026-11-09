import React from 'react';

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[176px] rounded-[12px] border border-[color:var(--bjork-border)] bg-[var(--bjork-menu)] p-2.5 text-[12px] text-[color:var(--bjork-text)] shadow-[var(--bjork-shadow-menu)] backdrop-blur-xl">
      <p className="text-[11.5px] font-medium text-[color:var(--bjork-text-muted)]">{label}</p>
      <dl className="mt-1.5 space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-[color:var(--bjork-text-medium)]">
              <span className="h-[2px] w-2.5 rounded-full bg-[var(--bjork-accent)]" />
              {entry.name || 'Valor'}
            </dt>
            <dd className="font-mono tabular-nums">
              {typeof entry.value === 'number' ? entry.value.toLocaleString('es-CO') : entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
