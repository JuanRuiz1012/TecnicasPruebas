import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, title, subtitle, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`surface-card flex h-full flex-col overflow-hidden p-4 ${className}`}
    >
      {title && (
        <div className="mb-3">
          <h2 className="text-[13.5px] font-semibold text-[color:var(--bjork-text)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12px] text-[color:var(--bjork-text-muted)]">{subtitle}</p>}
        </div>
      )}
      <div className="relative h-full w-full flex-1">{children}</div>
    </motion.section>
  );
}
