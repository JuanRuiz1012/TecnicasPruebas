from app.repositories.siniestro_repository import SiniestroRepository
from app.models.filter_model import DashboardFilters

class DashboardService:
    def __init__(self):
        self.repository = SiniestroRepository()

    def get_descriptive_analytics(self, filters: DashboardFilters) -> dict:
        total = self.repository.get_total_count(filters)

        # 5 Gráficas Estadísticas Descriptivas
        graf_ciudad = self.repository.get_group_by_count("ciudad", filters)
        graf_gravedad = self.repository.get_group_by_count("gravedad", filters)
        graf_clase = self.repository.get_group_by_count("clase_accidente", filters)
        graf_anio = self.repository.get_group_by_count("anio", filters)
        graf_dia = self.repository.get_group_by_count("dia_semana", filters)

        # 10 Métricas KPI
        metricas = {
            "total_siniestros": total,
            "ciudades_afectadas": len(graf_ciudad),
            "gravedad_principal": graf_gravedad[0]["categoria"] if graf_gravedad else "N/A",
            "clase_principal": graf_clase[0]["categoria"] if graf_clase else "N/A",
            "ciudad_mas_critica": graf_ciudad[0]["categoria"] if graf_ciudad else "N/A",
            "dia_mas_peligroso": graf_dia[0]["categoria"] if graf_dia else "N/A",
            "anio_con_mas_casos": graf_anio[0]["categoria"] if graf_anio else "N/A",
            "porcentaje_solo_danos": self._calc_porcentaje(graf_gravedad, total, "SOLO DAÑOS"),
            "porcentaje_con_heridos": self._calc_porcentaje(graf_gravedad, total, "CON HERIDOS"),
            "tasa_mortalidad_por_mil": self._calc_tasa_mortalidad(graf_gravedad, total)
        }

        return {
            "metricas_descriptivas": metricas,
            "graficas_descriptivas": {
                "siniestros_por_ciudad": graf_ciudad,
                "siniestros_por_gravedad": graf_gravedad,
                "siniestros_por_clase": graf_clase,
                "tendencia_anual": graf_anio,
                "distribucion_semanal": graf_dia
            }
        }

    def _calc_porcentaje(self, gravedad_list, total, categoria) -> float:
        if not total: return 0.0
        conteo = sum(g["total"] for g in gravedad_list if g["categoria"] == categoria)
        return round((conteo / total) * 100, 2)

    def _calc_tasa_mortalidad(self, gravedad_list, total) -> float:
        if not total: return 0.0
        muertos = sum(g["total"] for g in gravedad_list if g["categoria"] == "CON MUERTOS")
        return round((muertos / total) * 1000, 2)