import axios from 'axios';

// API Base URL - change this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 Client API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // You can redirect to login page here if needed
    }
    return Promise.reject(error);
  }
);

// ==================== PROFILE API ====================
export const profileAPI = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
};

// ==================== PROJECTS API ====================
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return Array.isArray(response.data) ? response.data : [];
  },
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// ==================== BLOGS API ====================
export const blogsAPI = {
  getAll: async () => {
    const response = await api.get('/blogs?published=true');
    return Array.isArray(response.data) ? response.data : [];
  },
  getById: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/blogs', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
};

// ==================== EXPERIENCE API ====================
export const experienceAPI = {
  getAll: async () => {
    const response = await api.get('/experience');
    return Array.isArray(response.data) ? response.data : [];
  },
  getById: async (id: string) => {
    const response = await api.get(`/experience/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/experience', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/experience/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  },
};

// ==================== CONTACTS API ====================
export const contactsAPI = {
  submit: async (data: any) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

// ==================== AUTH API ====================
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
  check: async () => {
    const response = await api.get('/auth/check');
    return response.data;
  },
};

// ==================== ANALYTICS API ====================
export const analyticsAPI = {
  track: async (data: any) => {
    const response = await api.post('/analytics/track', data);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },
};

export default api;
