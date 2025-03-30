import { useState } from 'react'
import './Header.css'
import logo from '../../assets/images/logo.png'

const Header = ({ searchTerm, setSearchTerm }) => {
  const [cartItems, setCartItems] = useState(0)

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>
          
          <div className="search-box mx-auto">
            <form className="d-flex position-relative" onSubmit={(e) => { e.preventDefault(); console.log('Searching for:', searchTerm); }}>
              <input 
                className="form-control search-input" 
                type="search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Bạn cần tìm gì?"
              />
              <button className="btn search-btn" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <div className="nav-actions">
            <a href="tel:1800-2097" className="action-item">
              <i className="bi bi-telephone"></i>
              <div className="action-text">
                <small>Gọi mua hàng:</small>
                <strong>1800.2097</strong>
              </div>
            </a>

            <button className="action-item cart-btn" onClick={() => console.log('Toggle cart')}>
              <i className="bi bi-bag"></i>
              <div className="action-text">
                <span>Giỏ hàng</span>
              </div>
            </button>

            <div className="auth-buttons">
              <button className="btn-login" onClick={() => console.log('Login clicked')} style={{ width: '100px' }}>
                <span>Đăng nhập</span>
              </button>
              <button className="btn-register" onClick={() => console.log('Register clicked')} style={{ width: '100px' }}>
                <span>Đăng ký</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header