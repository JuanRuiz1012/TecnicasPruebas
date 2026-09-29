from pydantic import BaseModel
from typing import List, Dict, Any

class MetricasDescriptivas(BaseModel):
    total_siniestros: int
    ciudades_afectadas: int
    gravedad_principal: str
    clase_principal: str
    ciudad_mas_critica: str
    dia_mas_peligroso: str
    anio_con_mas_casos: str
    porcentaje_solo_danos: float
    porcentaje_con_heridos: float
    tasa_mortalidad_por_mil: float

class DashboardResponse(BaseModel):
    metricas_descriptivas: MetricasDescriptivas
    graficas_descriptivas: Dict[str, List[Dict[str, Any]]]