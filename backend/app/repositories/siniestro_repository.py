from app.database.mongo_client import mongo_db
from app.models.filter_model import DashboardFilters

class SiniestroRepository:
    def __init__(self):
        # Conexión a la colección usando el Singleton
        self.collection = mongo_db.get_collection("siniestros")

    def _build_match_stage(self, filters: DashboardFilters) -> dict:
        """Construye el filtro dinámico para MongoDB a partir de los 10 parámetros."""
        query = {}
        if filters.ciudad: query["ciudad"] = filters.ciudad
        if filters.gravedad: query["gravedad"] = filters.gravedad
        if filters.clase_accidente: query["clase_accidente"] = filters.clase_accidente
        if filters.barrio_localidad: query["barrio_localidad"] = filters.barrio_localidad
        if filters.mes: query["mes"] = filters.mes
        if filters.dia_semana: query["dia_semana"] = filters.dia_semana

        # Rango de años
        if filters.anio_inicio or filters.anio_fin:
            query["anio"] = {}
            if filters.anio_inicio: query["anio"]["$gte"] = filters.anio_inicio
            if filters.anio_fin: query["anio"]["$lte"] = filters.anio_fin

        # Rango de horas
        if filters.hora_inicio is not None or filters.hora_fin is not None:
            query["hora"] = {}
            if filters.hora_inicio is not None: query["hora"]["$gte"] = filters.hora_inicio
            if filters.hora_fin is not None: query["hora"]["$lte"] = filters.hora_fin

        return query

    def get_total_count(self, filters: DashboardFilters) -> int:
        query = self._build_match_stage(filters)
        return self.collection.count_documents(query)

    def get_group_by_count(self, field: str, filters: DashboardFilters, limit: int = 15) -> list:
        """Pipeline de agregación para obtener datos de gráficas."""
        match_stage = {"$match": self._build_match_stage(filters)}
        group_stage = {"$group": {"_id": f"${field}", "total": {"$sum": 1}}}
        sort_stage = {"$sort": {"total": -1}}
        limit_stage = {"$limit": limit}

        pipeline = [match_stage, group_stage, sort_stage, limit_stage]
        results = list(self.collection.aggregate(pipeline))
        return [{"categoria": str(r["_id"]), "total": r["total"]} for r in results if r["_id"] is not None]