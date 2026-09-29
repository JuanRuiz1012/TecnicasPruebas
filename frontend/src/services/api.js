import { getToken } from './authService';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export async function fetchDescriptiveDashboard(filters = {}) {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/dashboard/descriptive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Enviamos los filtros gerenciales elegidos por el usuario (o vacíos por defecto)
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error conectando con la API de FastAPI:", error);
    return null;
  }
}