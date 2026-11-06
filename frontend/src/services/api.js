import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guest session ID management
let sessionId = localStorage.getItem('nova_session_id');
if (!sessionId) {
  sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('nova_session_id', sessionId);
}

// Request interceptor to inject JWT and session ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nova_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Session-ID'] = sessionId;
  return config;
});

// Response interceptor to handle token expiration & unified error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear on failed login attempt
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('nova_access_token');
        localStorage.removeItem('nova_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  addAddress: (data) => api.post('/auth/me/address', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  getTrending: (limit = 8) => api.get('/products/trending', { params: { limit } }),
  getProductDetails: (slugOrId) => api.get(`/products/${slugOrId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (id, data) => api.put(`/cart/items/${id}`, data),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  applyCoupon: (code) => api.post('/cart/apply-coupon', { code }),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post(`/wishlist/toggle/${productId}`),
  addToWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (idOrNumber) => api.get(`/orders/${idOrNumber}`),
  updateOrderStatus: (idOrNumber, data) => api.put(`/orders/${idOrNumber}/status`, data),
};

export const paymentsAPI = {
  createPaymentOrder: (orderId) => api.post('/payments/create-order', { order_id: orderId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export const reviewsAPI = {
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  submitReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  search: (query) => api.post('/ai/search', { query }),
  recommendations: (params) => api.post('/ai/recommendations', params),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getInventory: () => api.get('/admin/inventory'),
};

export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter/subscribe', data),
};

export default api;
