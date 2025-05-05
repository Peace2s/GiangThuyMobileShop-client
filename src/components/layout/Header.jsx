import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout, Input, Button, Menu, Space, Typography, Row, Col, Badge, Avatar, Tooltip, Dropdown, message, AutoComplete } from 'antd'
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons'
import './Header.css'
import logo from '../../assets/images/logo.png'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { productService } from '../../services/home.service'

const { Header: AntHeader } = Layout
const { Search } = Input
const { Text } = Typography

const Header = () => {
  const { getCartCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
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

  const handleSearch = (value) => {
    const searchParams = new URLSearchParams(location.search);
    
    if (!value.trim()) {
      searchParams.delete('q');
    } else {
      searchParams.set('q', value);
    }

    if (!searchParams.has('branch')) {
      searchParams.set('branch', 'all');
    }
    
    if (location.pathname === '/') {
      navigate(`/?${searchParams.toString()}`);
    } else {
      navigate(`/?${searchParams.toString()}`);
    }
  };

  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await productService.searchProducts({ q: value, limit: 5 });
      const products = response.data.data || [];
      setSuggestions(products.map(product => ({
        value: product.name,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '30px', height: '30px', objectFit: 'cover' }} 
            />
            <span>{product.name}</span>
          </div>
        )
      })));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((value) => {
      fetchSuggestions(value);
    }, 500),
    []
  );

  const handleSearchChange = (value) => {
    setSearchValue(value);
    debouncedFetchSuggestions(value);
  };

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
          <AutoComplete
            options={suggestions}
            value={searchValue}
            onChange={handleSearchChange}
            onSelect={(value) => {
              setSearchValue(value);
              handleSearch(value);
            }}
            style={{ width: '100%' }}
            notFoundContent={loading ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
          >
            <Input.Search
              placeholder="Bạn cần tìm gì?"
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
              className="search-input"
            />
          </AutoComplete>
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

// Hàm debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Header