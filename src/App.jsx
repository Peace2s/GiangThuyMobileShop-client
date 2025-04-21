import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProductDetail from './components/product/ProductDetail'
import Cart from './components/cart/Cart'
import Checkout from './components/checkout/Checkout'
import BranchMenu from './components/layout/BranchMenu'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
  
// Wrapper component to handle layout
const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'
  const isProductDetail = location.pathname.startsWith('/product/') && location.pathname !== '/product'
  const isCartPage = location.pathname === '/cart'
  const isCheckoutPage = location.pathname === '/checkout'
  const isHomePage = location.pathname === '/'

  return (
    <div className="app">
      {!isLoginPage && !isRegisterPage && <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      {isHomePage && <BranchMenu />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
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
      {!isLoginPage && !isRegisterPage && !isProductDetail && !isCartPage && !isCheckoutPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
          <ToastContainer />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App