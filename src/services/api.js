import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('inec_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
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

// ── Auth ──────────────────────────────────────────────────
export const loginUser = (credentials) =>
  API.post('/login', credentials);

export const registerUser = (data) =>
  API.post('/register', data);

// ── Results (mock endpoints — swap with real when available) ──
export const getNationalResults  = () => API.get('/results/national').catch(() => ({ data: null }));
export const getStateResults     = (stateCode) => API.get(`/results/state/${stateCode}`).catch(() => ({ data: null }));
export const getLGAResults       = (lgaCode) => API.get(`/results/lga/${lgaCode}`).catch(() => ({ data: null }));
export const getAllElections      = () => API.get('/elections').catch(() => ({ data: null }));

export default API;
