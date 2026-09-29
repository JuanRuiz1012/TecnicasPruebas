import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, title, subtitle, className = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col h-full glass-panel p-6 overflow-hidden ${className}`}
    >
      {title && (
        <div className="mb-4">
          {/* Usamos el color dinámico var(--text-main) en lugar de text-white fijo */}
          <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)]">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1 relative w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}