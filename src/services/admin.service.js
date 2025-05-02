import axios from 'axios';
import API_URL from '../config/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminService = {
  // Auth
  login: (data) => adminApi.post('/auth/login', data),

  // Products
  getProducts: (params) => adminApi.get('/products/admin/all', { params }),
  getProductById: (id) => adminApi.get(`/products/${id}`),
  createProduct: (data) => adminApi.post('/products', data),
  updateProduct: (id, data) => adminApi.put(`/products/${id}`, data),
  deleteProduct: (id) => adminApi.delete(`/products/${id}`),

  // Orders
  getOrders: (params) => adminApi.get('/orders/admin/all', { params }),
  getOrderById: (id) => adminApi.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => adminApi.put(`/orders/admin/${id}/status`, data),

  // Users
  getUsers: (params) => adminApi.get('/users', { params }),
  getUserById: (id) => adminApi.get(`/users/${id}`),
  updateUser: (id, data) => adminApi.put(`/users/${id}`, data),
  deleteUser: (id) => adminApi.delete(`/users/${id}`),

  // Statistics
  getStatistics: () => adminApi.get('/statistics'),
  getRevenueByMonth: (year) => adminApi.get(`/statistics/revenue/${year}`),
  getTopProducts: (limit) => adminApi.get(`/statistics/top-products/${limit}`),
  getMonthlyRevenue: () => adminApi.get('/statistics/monthly-revenue'),

  createProductVariant: (data) => adminApi.post('/variants', data),
  updateProductVariant: (id, data) => adminApi.put(`/variants/${id}`, data),
  deleteProductVariant: (id) => adminApi.delete(`/variants/${id}`),
}; 