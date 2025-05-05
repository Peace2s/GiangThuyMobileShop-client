import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service cho sản phẩm
export const productService = {
  getAllProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByBrand: (brand, params = {}) => api.get(`/products/brand/${brand}`, { params }),
  getProductsByBrandAndPrice: (brand, minPrice, maxPrice, params = {}) => 
    api.get(`/products/brand/${brand}?minPrice=${minPrice}&maxPrice=${maxPrice}`, { params }),
  getFeaturedProducts: () => api.get('/products/featured'),
  getNewProducts: () => api.get('/products/new'),
  getProductsByPrice: (minPrice, maxPrice, params = {}) => api.get(`/products?minPrice=${minPrice}&maxPrice=${maxPrice}`, { params }),
  searchProducts: (params) => {
    const { q, minPrice, maxPrice, brand, page, limit } = params;
    const queryParams = new URLSearchParams();
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (brand) queryParams.append('brand', brand);
    if (q) queryParams.append('q', q);
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    return api.get(`/products/search?${queryParams.toString()}`);
  },
};

// Service cho xác thực
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },
  getCurrentUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Service cho giỏ hàng
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productData) => api.post('/cart/add', productData),
  updateCartItem: (cartItemId, quantity) => api.put(`/cart/items/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Service cho đơn hàng
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  createPaymentUrl: (orderData) => api.post('/payment/create-payment-url', orderData),
  cancelSepayOrder: (orderId) => api.post(`/payment/cancel-sepay-order/${orderId}`),
  checkSepayPaymentStatus: (orderId) => api.get(`/payment/check-sepay-status/${orderId}`)
};

// Brand services
export const brandService = {
  getAllBrands: () => api.get('/brands'),
  getBrandById: (id) => api.get(`/brands/${id}`)
};

export default api; 