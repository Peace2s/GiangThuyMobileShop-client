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

// Xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token và thông tin user khi token hết hạn
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service cho sản phẩm
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByBrand: (brand) => api.get(`/products/brand/${brand}`),
  getProductsByBrandAndPrice: (brand, minPrice, maxPrice) => 
    api.get(`/products/brand/${brand}?minPrice=${minPrice}&maxPrice=${maxPrice}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getNewProducts: () => api.get('/products/new'),
  getProductsByPrice: (minPrice, maxPrice) => api.get(`/products?minPrice=${minPrice}&maxPrice=${maxPrice}`),
  searchProducts: (params) => {
    const { q, minPrice, maxPrice, brand } = params;
    let url = '/products/search?';
    const queryParams = new URLSearchParams();
    
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (brand) queryParams.append('brand', brand);
    if (q) queryParams.append('q', q);
    
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

export default api; 