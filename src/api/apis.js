import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
});

// Attach token to every request if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const register = async (userData) => {
  try {
    const res = await API.post('/auth/register', userData);
    console.log('res---------', res);
    return res;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Unexpected registration error:", error);
      throw new Error("Something went wrong during registration");
    }
  }
};

export const login = (userData) => API.post('/auth/login', userData);

// Health Profile
export const createProfile = (profileData, token) => {
  return API.post('/health/profile', profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getProfile = (token) =>
  API.get('/health/profile', { headers: { Authorization: `Bearer ${token}` } });

// Meal Plan
export const getMealPlan = (token) =>
  API.get('/meal/recommend', { headers: { Authorization: `Bearer ${token}` } });

// Chat with AI
export const chatWithAI = async (message, token) => {
  try {
    const res = await API.post(
      '/chat', // Assuming your backend endpoint is POST /api/chat
      {message}, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', } }
    );
    return res.data; // { reply: "..." }
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

export default API;
