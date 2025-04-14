import { Typography, Button, Row, Col, Card, Tag } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { getFeaturedProducts, getNewProducts, products } from '../../data/mockData'
import './MainContent.css'
import Banner from './Banner'

const { Title, Text } = Typography

const MainContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const branch = new URLSearchParams(location.search).get('branch')

  const branchNames = {
    'all': 'Tất cả sản phẩm',
    'apple': 'Apple',
    'samsung': 'Samsung',
    'oppo': 'Oppo',
    'xiaomi': 'Xiaomi',
    'oneplus': 'OnePlus'
  }

  const filteredProducts = branch === 'all' 
    ? products 
    : branch 
    ? products.filter(product => product.branch === branch)
    : products;

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } })
  }

  const renderProductCard = (product) => {
    const discountedPrice = product.price * (1 - product.discount / 100)
    
    return (
      <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
        <Card 
          hoverable 
          cover={<img alt={product.name} src={product.image} />}
          className="product-card"
          onClick={() => handleProductClick(product)}
          actions={[
            <Button 
              type="primary" 
              className="add-to-cart-btn"
              style={{ width: '90%' }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Add to cart:', product)
              }}
              block
            >
              Thêm vào giỏ
            </Button>
          ]}
        >
          <Card.Meta
            title={
              <div className="product-title">
                <Text strong>{product.name}</Text>
              </div>
            }
            description={
              <div className="product-price">
                <div className="price-main">
                  <Text strong className="discounted-price">
                    {discountedPrice.toLocaleString()}đ
                  </Text>
                  <Text delete type="secondary" className="original-price">
                    {product.price.toLocaleString()}đ
                  </Text>
                </div>
                <Text type="danger" className="discount-tag">
                  -{product.discount}%
                </Text>
              </div>
            }
          />
        </Card>
      </Col>
    )
  }

  const renderProductSection = (title, products) => (
    <div className="product-section">
      <div className="section-header">
        <Title level={4}>{title}</Title>
        <Button 
          type="link" 
          className="view-all-btn"
          onClick={() => navigate(`/?branch=all`)}
        >
          Xem tất cả <RightOutlined />
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        {products.slice(0, 3).map(renderProductCard)}
      </Row>
    </div>
  )

  const renderFilteredProducts = () => (
    <div className="filtered-products">
      <div className="section-header">
        <Title level={3}>{branchNames[branch] || 'Tất cả sản phẩm'}</Title>
      </div>
      <Row gutter={[24, 24]}>
        {filteredProducts.map(renderProductCard)}
      </Row>
    </div>
  )

  return (
    <div className="main-content">
      <Banner />
      {branch ? (
        renderFilteredProducts()
      ) : (
        <>
          {renderProductSection('SẢN PHẨM NỔI BẬT', getFeaturedProducts())}
          {renderProductSection('SẢN PHẨM MỚI', getNewProducts())}
        </>
      )}
    </div>
  )
}

export default MainContent