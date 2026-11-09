import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { Card } from '../common/Card';
import { CityChart } from './CityChart';
import { GravityChart } from './GravityChart';
import { ClassChart } from './ClassChart';
import { TrendChart } from './TrendChart';
import { WeeklyChart } from './WeeklyChart';
import { FilterPanel } from './FilterPanel';
import { useDashboardData } from '../../hooks/useDashboardData';

const ResponsiveGridLayout = WidthProvider(Responsive);

const bar = 'rounded-[6px] bg-[var(--bjork-surface-active)]';

// Misma silueta que el grid real (rowHeight 100 + margen 10): 4 KPIs, 2 gráficas anchas y 3 angostas
function DashboardSkeleton() {
    const chart = (key) => (
        <div key={key} className="surface-card flex h-[310px] flex-col p-4">
            <div className={`${bar} h-3.5 w-1/3`} />
            <div className="mt-5 flex flex-1 items-end gap-2">
                {[55, 80, 40, 95, 65, 30, 70].map((h, i) => (
                    <div key={i} className={`${bar} flex-1`} style={{ height: `${h}%` }} />
                ))}
            </div>
        </div>
    );
    return (
        <div role="status" aria-label="Cargando datos del dashboard" className="space-y-[10px] motion-safe:animate-pulse">
            <span className="sr-only">Consultando registros en MongoDB…</span>
            <div className="grid grid-cols-2 gap-[10px] lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="surface-card flex h-[100px] flex-col justify-center p-4">
                        <div className={`${bar} h-3 w-1/2`} />
                        <div className={`${bar} mt-3 h-6 w-2/3`} />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">{[0, 1].map(chart)}</div>
            <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-3">{[2, 3, 4].map(chart)}</div>
        </div>
    );
}

function Kpi({ label, value }) {
    return (
        <article className="surface-card flex h-full min-w-0 flex-col justify-center p-4">
            <h3 className="text-[12.5px] font-medium text-[color:var(--bjork-text-muted)]">{label}</h3>
            <p className="mt-2 truncate text-[24px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{value ?? '—'}</p>
        </article>
    );
}

export function DashboardGrid() {
    const [filters, setFilters] = useState({});
    const { data, loading, error } = useDashboardData(filters);

    const defaultLayout = [
        { i: 'kpi-1', x: 0, y: 0, w: 3, h: 1, minW: 2, minH: 1 },
        { i: 'kpi-2', x: 3, y: 0, w: 3, h: 1, minW: 2, minH: 1 },
        { i: 'kpi-3', x: 6, y: 0, w: 3, h: 1, minW: 2, minH: 1 },
        { i: 'kpi-4', x: 9, y: 0, w: 3, h: 1, minW: 2, minH: 1 },
        { i: 'chart-cities', x: 0, y: 1, w: 6, h: 3, minW: 4, minH: 2 },
        { i: 'chart-gravity', x: 6, y: 1, w: 6, h: 3, minW: 4, minH: 2 },
        { i: 'chart-class', x: 0, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'chart-trend', x: 4, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'chart-weekly', x: 8, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
    ];

    // FilterPanel va siempre en la misma posición: React no lo desmonta al cargar y conserva lo seleccionado
    const filterPanel = <FilterPanel onApplyFilters={setFilters} />;

    if (loading) {
        return (
            <div className="w-full space-y-4">
                {filterPanel}
                <DashboardSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full space-y-4">
                {filterPanel}
                <div role="alert" className="rounded-[12px] bg-[var(--bjork-error-soft)] p-4 text-[13px] text-[color:var(--bjork-error)]">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const metrics = data?.metricas_descriptivas || {};
    const charts = data?.graficas_descriptivas || {};

    return (
        <div className="w-full space-y-4">
            {filterPanel}

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: defaultLayout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                containerPadding={[0, 0]}
                isDraggable={true}
                isResizable={true}
            >
                <div key="kpi-1"><Kpi label="Total siniestros" value={metrics.total_siniestros?.toLocaleString('es-CO')} /></div>
                <div key="kpi-2"><Kpi label="Tasa de mortalidad" value={`${metrics.tasa_mortalidad_por_mil}‰`} /></div>
                <div key="kpi-3"><Kpi label="Con heridos" value={`${metrics.porcentaje_con_heridos}%`} /></div>
                <div key="kpi-4"><Kpi label="Ciudad más crítica" value={metrics.ciudad_mas_critica} /></div>

                <div key="chart-cities">
                    <Card title="Siniestros por Ciudad">
                        <CityChart data={charts.siniestros_por_ciudad} />
                    </Card>
                </div>

                <div key="chart-gravity">
                    <Card title="Distribución por Gravedad">
                        <GravityChart data={charts.siniestros_por_gravedad} />
                    </Card>
                </div>

                <div key="chart-class">
                    <Card title="Siniestros por Clase">
                        <ClassChart data={charts.siniestros_por_clase} />
                    </Card>
                </div>

                <div key="chart-trend">
                    <Card title="Tendencia Anual">
                        <TrendChart data={charts.tendencia_anual} />
                    </Card>
                </div>

                <div key="chart-weekly">
                    <Card title="Distribución Semanal">
                        <WeeklyChart data={charts.distribucion_semanal} />
                    </Card>
                </div>

            </ResponsiveGridLayout>
        </div>
    );
}