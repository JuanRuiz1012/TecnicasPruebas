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
import { PredictorWidget } from './PredictorWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
        // Añadimos las coordenadas del widget predictivo abarcando todo el ancho (w: 12) debajo de las gráficas
        { i: 'predictor', x: 0, y: 7, w: 12, h: 3, minW: 6, minH: 3 },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-text-muted animate-pulse text-lg">Consultando el millón de registros en MongoDB...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-soft text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    const metrics = data?.metricas_descriptivas || {};
    const charts = data?.graficas_descriptivas || {};

    return (
        <div className="w-full space-y-4">
            <FilterPanel onApplyFilters={(newFilters) => setFilters(newFilters)} />

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
                <div key="kpi-1"><Card><p className="text-sm text-text-muted">Total Siniestros</p><p className="text-2xl font-bold text-text-main">{metrics.total_siniestros?.toLocaleString()}</p></Card></div>
                <div key="kpi-2"><Card><p className="text-sm text-text-muted">Tasa Mortalidad</p><p className="text-2xl font-bold text-text-main">{metrics.tasa_mortalidad_por_mil}‰</p></Card></div>
                <div key="kpi-3"><Card><p className="text-sm text-text-muted">% Con Heridos</p><p className="text-2xl font-bold text-text-main">{metrics.porcentaje_con_heridos}%</p></Card></div>
                <div key="kpi-4"><Card><p className="text-sm text-text-muted">Ciudad Crítica</p><p className="text-2xl font-bold text-text-main">{metrics.ciudad_mas_critica}</p></Card></div>

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

                <div key="predictor">
                    <PredictorWidget />
                </div>
            </ResponsiveGridLayout>
        </div>
    );
}