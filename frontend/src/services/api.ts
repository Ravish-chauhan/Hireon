import axios from 'axios';

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });

    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('🌐 Network connectivity issue - Backend may be temporarily unavailable');
      return Promise.reject({ error: 'Network Error', message: 'Backend temporarily unavailable. Please try again in a few minutes.' });
    }

    return Promise.reject(error.response?.data || { error: error.message });
  }
);

export default api;
