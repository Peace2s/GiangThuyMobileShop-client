import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import ProductDetail from './components/product/ProductDetail'
import './App.css'

// Wrapper component to handle layout
const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isProductDetail = location.pathname.startsWith('/product/') && location.pathname !== '/product'

  return (
    <div className="app">
      {!isLoginPage && <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      <Routes>
        <Route path="/login" element={<Login />} />
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
      {!isLoginPage && !isProductDetail && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App