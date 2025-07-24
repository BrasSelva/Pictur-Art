//api.js
import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: isLocalhost 
    ? 'http://localhost:5000/api'
    : 'https://backendpicturart.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute le token automatiquement
api.interceptors.request.use((config) => {
  try {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Erreur lecture token dans localStorage', error);
  }
  return config;
});

// Nouvelle instance pour les requêtes FormData
export const apiForm = axios.create({
  baseURL: isLocalhost 
    ? 'http://localhost:5000/api'
    : 'https://backendpicturart.onrender.com/api',
});

// Ajout du token aussi pour apiForm
apiForm.interceptors.request.use((config) => {
  try {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Erreur lecture token dans localStorage', error);
  }
  return config;
});

export default api;