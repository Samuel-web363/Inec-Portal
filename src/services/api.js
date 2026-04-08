import axios from 'axios';

// Smart base URL
const BASE_URL = import.meta.env.PROD
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('inec_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('inec_token');
      localStorage.removeItem('inec_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginUser = (data) => API.post('/login', data);
export const registerUser = (data) => API.post('/register', data);

// Results
export const getNationalResults = () => API.get('/results/national');
export const getStateResults = (stateCode) => API.get(`/results/state/${stateCode}`);
export const getLGAResults = (lgaCode) => API.get(`/results/lga/${lgaCode}`);
export const getAllElections = () => API.get('/elections');

export default API;