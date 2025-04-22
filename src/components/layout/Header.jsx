import React from 'react'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout, Input, Button, Menu, Space, Typography, Row, Col, Badge, Avatar, Tooltip, Dropdown } from 'antd'
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons'
import './Header.css'
import logo from '../../assets/images/logo.png'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const { Header: AntHeader } = Layout
const { Search } = Input
const { Text } = Typography

const Header = ({ searchTerm, setSearchTerm }) => {
  const { getCartCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isProductDetailPage = location.pathname.startsWith('/product/')

  const handleCartClick = () => {
    navigate('/cart')
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Thông tin cá nhân',
        onClick: () => navigate('/profile')
      },
      {
        key: 'orders',
        icon: <ShoppingCartOutlined />,
        label: 'Đơn hàng',
        onClick: () => navigate('/orders')
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        onClick: handleLogout
      }
    ]
  };

  return (
    <AntHeader className="header">
      <Row className="container-fluid" align="middle" justify="space-between">
        <Col>
          <Link to="/" className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
        </Col>
        
        <Col flex="auto" className="search-box">
          <Search
            placeholder="Bạn cần tìm gì?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => console.log('Searching for:', value)}
            enterButton={<SearchOutlined />}
            size="large"
            className="search-input"
          />
        </Col>

        <Col className="nav-actions">
          <Space size="large">
            <Tooltip title="Giỏ hàng">
              <Badge count={getCartCount()} size="small">
                <Button 
                  type="text" 
                  className="action-item cart-btn" 
                  icon={<ShoppingCartOutlined className="action-icon" />}
                  onClick={handleCartClick}
                >
                  <div className="action-text">
                    <Typography.Text style={{ fontSize: '13px' }}>Giỏ hàng</Typography.Text>
                  </div>
                </Button>
              </Badge>
            </Tooltip>

            {isAuthenticated ? (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Button type="text" className="user-button">
                  <Avatar icon={<UserOutlined />} />
                  <span className="user-name">Xin chào, {user.fullName}</span>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button 
                  type="default" 
                  className="btn-login" 
                  icon={<UserOutlined />}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button 
                  type="primary" 
                  className="btn-register" 
                  onClick={() => navigate('/register')}
                >
                  Đăng ký
                </Button>
              </Space>
            )}
          </Space>
        </Col>
      </Row>
    </AntHeader>
  )
}

export default Header