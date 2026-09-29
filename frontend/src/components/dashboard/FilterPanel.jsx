import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function FilterPanel({ onApplyFilters }) {
  const [ciudad, setCiudad] = useState('');
  const [anio, setAnio] = useState('');
  const [gravedad, setGravedad] = useState('');

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const activeFilters = {};
    if (ciudad) activeFilters.ciudad = ciudad;
    if (anio) activeFilters.anio = parseInt(anio);
    if (gravedad) activeFilters.gravedad = gravedad;
    onApplyFilters(activeFilters);
  };

  const handleReset = () => {
    setCiudad('');
    setAnio('');
    setGravedad('');
    onApplyFilters({});
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 flex flex-wrap items-center gap-4 mb-6"
    >
      <div className="flex items-center gap-2 font-bold text-sm text-[var(--color-accent-blue, #0a84ff)] px-2">
        <Filter size={18} />
        <span>Filtros</span>
      </div>

      <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative flex-1 min-w-[180px]">
          <select 
            value={ciudad} 
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full h-11 px-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-full text-sm text-[var(--text-main)] appearance-none focus:outline-none focus:border-[var(--color-accent-blue)] cursor-pointer"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todas las ciudades</option>
            <option value="Bogotá" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bogotá</option>
            <option value="Medellín" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Medellín</option>
            <option value="Envigado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Envigado</option>
            <option value="Bucaramanga" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bucaramanga</option>
            <option value="Barranquilla" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Barranquilla</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-3.5 text-[var(--text-muted)] pointer-events-none" />
        </div>

        <div className="w-[150px]">
          <input 
            type="number" 
            placeholder="Año (ej. 2019)" 
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="w-full h-11 px-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-full text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-accent-blue)]"
          />
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <select 
            value={gravedad} 
            onChange={(e) => setGravedad(e.target.value)}
            className="w-full h-11 px-4 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-full text-sm text-[var(--text-main)] appearance-none focus:outline-none focus:border-[var(--color-accent-blue)] cursor-pointer"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cualquier gravedad</option>
            <option value="SOLO DAÑOS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Solo Daños</option>
            <option value="CON HERIDOS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Con Heridos</option>
            <option value="CON MUERTOS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Con Muertos</option>
          </select>
          <ChevronDown size= {16} className="absolute right-4 top-3.5 text-[var(--text-muted)] pointer-events-none" />
        </div>

        <button 
          type="submit"
          className="h-11 px-7 rounded-full font-bold text-sm bg-gradient-to-b from-[#4da3ff] via-[#0a84ff] to-[#5e5ce6] text-white shadow-[0_8px_24px_rgba(10,132,255,0.5)] hover:scale-105 transition-transform cursor-pointer"
        >
          Aplicar
        </button>

        <button 
          type="button"
          onClick={handleReset}
          className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Limpiar Filtros"
        >
          <RotateCcw size={18} />
        </button>
      </form>
    </motion.div>
  );
}