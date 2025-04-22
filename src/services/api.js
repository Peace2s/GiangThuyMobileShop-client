import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào header
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
  getFeaturedProducts: () => api.get('/products/featured'),
  getNewProducts: () => api.get('/products/new'),
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
};

export default api; 