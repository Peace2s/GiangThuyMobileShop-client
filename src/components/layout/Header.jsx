import React from 'react'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout, Input, Button, Menu, Space, Typography, Row, Col, Badge, Avatar, Tooltip } from 'antd'
import { SearchOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons'
import './Header.css'
import logo from '../../assets/images/logo.png'
import { useCart } from '../../contexts/CartContext'

const { Header: AntHeader } = Layout
const { Search } = Input
const { Text } = Typography

const Header = ({ searchTerm, setSearchTerm }) => {
  const { getCartItemsCount } = useCart()
  const [cartItems, setCartItems] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentBranch = searchParams.get('branch') || ''
  const isHomePage = location.pathname === '/'
  const isProductDetailPage = location.pathname.startsWith('/product/')

  const brands = [
    { id: 'all', name: 'Tất cả' },
    { id: 'apple', name: 'Apple' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'oppo', name: 'Oppo' },
    { id: 'xiaomi', name: 'Xiaomi' },
    { id: 'oneplus', name: 'OnePlus' }
  ]

  const handleBrandClick = (brandId) => {
    if (isProductDetailPage) {
      if (brandId === 'all') {
        navigate('/')
      } else {
        navigate(`/?branch=${brandId}`)
      }
      return
    }

    if (isHomePage && brandId === 'all') {
      navigate('/?branch=all')
      return
    }

    // Otherwise, just update the branch parameter
    const newSearchParams = new URLSearchParams(location.search)
    if (brandId === 'all') {
      newSearchParams.set('branch', 'all')
    } else {
      newSearchParams.set('branch', brandId)
    }
    navigate(`${location.pathname}?${newSearchParams.toString()}`)
  }

  // Determine which brand should be highlighted
  const getSelectedKey = () => {
    if (isHomePage && !currentBranch) {
      return ''; // No highlight on home page
    }
    return currentBranch || 'all';
  }

  const handleCartClick = () => {
    navigate('/cart')
  }

  const handleBranchClick = (branch) => {
    // Nếu đang ở trang giỏ hàng, chuyển về trang chủ với branch tương ứng
    if (location.pathname === '/cart') {
      navigate(`/?branch=${branch}`)
    } else {
      // Nếu đang ở trang khác, giữ nguyên behavior cũ
      navigate(`/?branch=${branch}`)
    }
  }

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
            <Tooltip title="Gọi mua hàng: 1800.2097">
              <a href="tel:1800-2097" className="action-item">
                <PhoneOutlined className="action-icon" />
                <div className="action-text">
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>Gọi mua hàng:</Typography.Text>
                  <Typography.Text strong style={{ fontSize: '13px' }}>1800.2097</Typography.Text>
                </div>
              </a>
            </Tooltip>

            <Tooltip title="Giỏ hàng">
              <Badge count={getCartItemsCount()} size="small">
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
                onClick={() => console.log('Register clicked')}
              >
                Đăng ký
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <div className="brands-filter">
        <Row justify="center">
          <Col>
            <Menu 
              mode="horizontal" 
              className="brands-list" 
              selectedKeys={[getSelectedKey()]}
              onClick={({ key }) => handleBranchClick(key)}
            >
              {brands.map(brand => (
                <Menu.Item key={brand.id} className="brand-item">
                  {brand.name}
                </Menu.Item>
              ))}
            </Menu>
          </Col>
        </Row>
      </div>
    </AntHeader>
  )
}

export default Header