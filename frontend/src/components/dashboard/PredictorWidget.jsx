import React, { useState } from 'react';
import { Card } from '../common/Card';
import { getToken } from '../../services/authService';
import { BrainCircuit, Sparkles, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

export function PredictorWidget() {
  const [clase, setClase] = useState('ATROPELLO');
  const [ciudad, setCiudad] = useState('Medellín');
  const [anio, setAnio] = useState(2028);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:8000/api/v1/predict/severity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clase, ciudad, anio: parseInt(anio) })
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Error en predicción:', err);
    }
    setLoading(false);
  };

  return (
    <Card title="Simulador Predictivo e Inteligencia Analítica (ML)" subtitle="Proyecciones de severidad con contexto gerencial para Colombia">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-center">
        
        <form onSubmit={handlePredict} className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Clase de Evento</label>
            <select 
              value={clase} 
              onChange={(e) => setClase(e.target.value)}
              className="w-full h-11 px-3 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-accent-blue)] cursor-pointer"
            >
              <option value="CHOQUE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Choque</option>
              <option value="ATROPELLO" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Atropello</option>
              <option value="VOLCAMIENTO" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Volcamiento</option>
              <option value="CAIDA OCUPANTE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Caída Ocupante</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Ciudad</label>
            <select 
              value={ciudad} 
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full h-11 px-3 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-accent-blue)] cursor-pointer"
            >
              <option value="Medellín" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Medellín</option>
              <option value="Bogotá" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bogotá</option>
              <option value="Bucaramanga" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bucaramanga</option>
              <option value="Envigado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Envigado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Año Proyectado</label>
            <input 
              type="number" 
              value={anio} 
              onChange={(e) => setAnio(e.target.value)}
              className="w-full h-11 px-3 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-accent-blue)]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-bold text-sm bg-gradient-to-b from-[#4da3ff] via-[#0a84ff] to-[#5e5ce6] text-white shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <BrainCircuit size={18} />
            {loading ? 'Generando análisis...' : 'Ejecutar Proyección IA'}
          </button>
        </form>

        <div className="lg:col-span-7 bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col justify-between space-y-4 h-full min-h-[250px]">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${result.nivel_riesgo_critico ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}>
                    {result.nivel_riesgo_critico ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-muted)] font-medium">Clasificación del Modelo</span>
                    <h4 className="text-sm font-extrabold text-[var(--text-main)]">{result.prediccion}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--text-muted)]">Nivel de Confianza</span>
                  <p className="text-sm font-bold text-[var(--color-accent-cyan, #64d2ff)]">{result.confianza_porcentaje}%</p>
                </div>
              </div>

              <div className="bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl p-4 text-xs leading-relaxed text-[var(--text-main)] flex gap-3 items-start">
                <FileText size={18} className="text-[var(--color-accent-blue)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1 text-[var(--color-accent-blue)]">Informe Analítico y Contextual (IA):</span>
                  <p className="opacity-90">{result.insight_gerencial}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[var(--text-muted)] space-y-2 text-center my-auto">
              <Sparkles size={32} className="mx-auto opacity-50 text-[var(--color-accent-cyan)]" />
              <p className="text-xs">Selecciona los parámetros de simulación (ej. Atropello en Medellín para el 2028) para generar el dictamen predictivo.</p>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
}