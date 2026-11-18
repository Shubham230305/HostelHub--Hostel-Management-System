import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const savedAuth = sessionStorage.getItem('hostelhub_auth');

    if (savedAuth) {
      const auth = JSON.parse(savedAuth);

      if (auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;