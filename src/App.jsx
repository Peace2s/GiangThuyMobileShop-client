import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import ProductDetail from './components/product/ProductDetail'
import Cart from './components/cart/Cart'
import Checkout from './components/checkout/Checkout'
import BranchMenu from './components/layout/BranchMenu'
import Orders from './components/orders/Orders'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import AdminLayout from './layouts/AdminLayout'
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import Users from './pages/admin/Users'

// Wrapper component to handle layout
const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'
  const isForgotPasswordPage = location.pathname === '/forgot-password'
  const isProfilePage = location.pathname === '/profile'
  const isProductDetail = location.pathname.startsWith('/product/') && location.pathname !== '/product'
  const isCartPage = location.pathname === '/cart'
  const isCheckoutPage = location.pathname === '/checkout'
  const isOrdersPage = location.pathname === '/orders'
  const isHomePage = location.pathname === '/'

  return (
    <div className="app">
      {!isLoginPage && !isRegisterPage && !isForgotPasswordPage && <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      {isHomePage && <BranchMenu />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={
            <div className="container-fluid">
              <ProductDetail />
            </div>
          } />
          <Route path="/product" element={
            <div className="main-container">
              <Sidebar />
              <MainContent showAllProducts={true} />
            </div>
          } />
          <Route path="/products" element={
            <div className="main-container">
              <Sidebar />
              <MainContent />
            </div>
          } />
          <Route path="/" element={
            <div className="main-container">
              <Sidebar />
              <MainContent />
            </div>
          } />
        </Routes>
      </div>
      {!isLoginPage && !isRegisterPage && !isForgotPasswordPage && !isProfilePage && !isProductDetail && !isCartPage && !isCheckoutPage && !isOrdersPage && <Footer />}
    </div>
  )
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken')
  return isAuthenticated ? children : <Navigate to="/admin/login" />
}

const App = () => {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<Users />} />
              </Route>

              {/* Client Routes */}
              <Route path="/*" element={<AppLayout />} />
            </Routes>
            <ToastContainer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App