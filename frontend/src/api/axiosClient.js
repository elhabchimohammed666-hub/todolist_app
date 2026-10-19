import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur de requêtes : Injection du token JWT si présent
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses : Gestion centralisée des erreurs HTTP
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Une erreur réseau inattendue est survenue',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Émission d'un événement personnalisé si nécessaire
    }

    return Promise.reject(customError);
  }
);
