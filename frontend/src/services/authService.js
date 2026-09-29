const API_URL = 'http://127.0.0.1:8000/api/v1';

export async function loginUser(username, password) {
  try {
    // FastAPI espera los datos en formato x-www-form-urlencoded para el token OAuth2
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();
    // Guardamos el token en el almacenamiento local del navegador
    localStorage.setItem('token', data.access_token);
    return true;
  } catch (error) {
    console.error('Error de autenticación:', error);
    return false;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logoutUser() {
  localStorage.removeItem('token');
}