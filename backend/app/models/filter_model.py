from pydantic import BaseModel
from typing import Optional

class DashboardFilters(BaseModel):
    # Requerimiento 14: 10 Filtros
    ciudad: Optional[str] = None
    anio_inicio: Optional[int] = None
    anio_fin: Optional[int] = None
    mes: Optional[str] = None
    dia_semana: Optional[str] = None
    gravedad: Optional[str] = None
    clase_accidente: Optional[str] = None
    barrio_localidad: Optional[str] = None
    hora_inicio: Optional[int] = None
    hora_fin: Optional[int] = None