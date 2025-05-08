import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserFromStorage } from '../utils/localStorage';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4321/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = getUserFromStorage();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
    
    toast.error(message);
    return Promise.reject(error);
  }
);

// API endpoints
export const productsApi = {
  getAll: (keyword = '', page = 1, category = '') => 
    api.get(`/products?keyword=${keyword}&page=${page}&category=${category}`),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: FormData) => api.post('/products', productData),
  update: (id: string, productData: FormData) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const authApi = {
  login: (email: string, password: string) => api.post('/users/login', { email, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/users', { username, email, password }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

export const userApi = {
  getAll: () => api.get('/users'),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const orderApi = {
  create: (orderData: any) => api.post('/orders', orderData),
  getById: (id: string) => api.get(`/orders/${id}`),
  pay: (id: string, paymentResult: any) => api.put(`/orders/${id}/pay`, paymentResult),
  getMyOrders: () => api.get('/orders/myorders'),
  getAll: () => api.get('/orders'),
};

export const paymentApi = {
  processStripe: (paymentData: any) => api.post('/payments/stripe', paymentData),
  createBitpayInvoice: (invoiceData: any) => api.post('/payments/bitpay', invoiceData),
};

export default api;