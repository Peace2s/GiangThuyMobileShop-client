import { useState } from 'react'
import './Header.css'
import logo from '../../assets/images/logo.png'

const Header = ({ searchTerm, setSearchTerm }) => {
  const [cartItems, setCartItems] = useState(0)

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="contact-info">
            <span>0128 922 0142</span>
            <span>HỆ THỐNG SIÊU THỊ</span>
          </div>
          <div className="user-actions">
            <a href="#" className="link">TÌM KIẾM</a>
            <a href="#" className="link">GIỎ HÀNG ({cartItems})</a>
            <a href="#" className="link">ĐĂNG NHẬP</a>
            <a href="#" className="link">TIN TỨC</a>
            <a href="#" className="link">LIÊN HỆ</a>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container main-header-content">
          <div className="logo">
            <a href="#">
              <img src={logo} alt="E-Shop Logo" />
            </a>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="category-nav">
        <div className="container">
          <ul className="category-menu">
            <li className="active"><a href="#">DANH MỤC SẢN PHẨM</a></li>
            <li><a href="#">KHUYẾN MÃI</a></li>
            <li><a href="#">THƯƠNG HIỆU</a></li>
            <li><a href="#">BÁN CHẠY</a></li>
            <li><a href="#">SẢN PHẨM MỚI</a></li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header