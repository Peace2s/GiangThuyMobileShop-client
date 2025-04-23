import { Typography, Button, Row, Col, Card, Tag, Tooltip } from 'antd'
import { RightOutlined, MobileOutlined, CameraOutlined, ThunderboltOutlined, DesktopOutlined, FireOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { productService } from '../../services/home.service'
import { useCart } from '../../contexts/CartContext'
import './MainContent.css'
import Banner from './Banner'
import { useState, useEffect } from 'react'

const { Title, Text } = Typography

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const MainContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const branch = searchParams.get('branch')
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null
  
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let response;
        
        if (branch && branch !== 'all') {
          // Fetch products by brand
          response = await productService.getProductsByBrand(branch)
        } else if (branch === 'all') {
          // Fetch all products
          response = await productService.getAllProducts()
        } else {
          // Fetch featured and new products for homepage
          const [featuredRes, newRes] = await Promise.all([
            productService.getFeaturedProducts(),
            productService.getNewProducts()
          ])
          setFeaturedProducts(featuredRes.data)
          setNewProducts(newRes.data)
          setLoading(false)
          return;
        }
        
        // Lọc sản phẩm theo khoảng giá nếu có
        let filteredProducts = response.data;
        if (minPrice !== null || maxPrice !== null) {
          filteredProducts = response.data.filter(product => {
            const price = product.discount_price || product.price;
            const meetsMinPrice = minPrice === null || price >= minPrice;
            const meetsMaxPrice = maxPrice === null || price <= maxPrice;
            return meetsMinPrice && meetsMaxPrice;
          });
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [branch, minPrice, maxPrice])

  const branchNames = {
    'all': 'Tất cả sản phẩm',
    'apple': 'Apple',
    'samsung': 'Samsung',
    'oppo': 'Oppo',
    'xiaomi': 'Xiaomi',
    'oneplus': 'OnePlus'
  }

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } })
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const renderProductSpecs = (product) => {
    return (
      <div className="product-specs">
        {product.screen && (
          <Tooltip title={product.screen}>
            <div className="spec-item">
              <DesktopOutlined /> Màn hình
            </div>
          </Tooltip>
        )}
        {product.processor && (
          <Tooltip title={product.processor}>
            <div className="spec-item">
              <ThunderboltOutlined /> Chip
            </div>
          </Tooltip>
        )}
        {product.ram && (
          <Tooltip title={`RAM ${product.ram}`}>
            <div className="spec-item">
              <MobileOutlined /> RAM
            </div>
          </Tooltip>
        )}
        {product.camera && (
          <Tooltip title={product.camera}>
            <div className="spec-item">
              <CameraOutlined /> Camera
            </div>
          </Tooltip>
        )}
        {product.battery && (
          <Tooltip title={product.battery}>
            <div className="spec-item">
              <FireOutlined /> Pin
            </div>
          </Tooltip>
        )}
      </div>
    )
  }

  const renderProductCard = (product) => {
    const discountedPrice = product.discount_price || product.price
    
    return (
      <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
        <Card 
          hoverable 
          cover={<img alt={product.name} src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} width="100%" height="100%" />}
          className="product-card"
          onClick={() => handleProductClick(product)}
          actions={[
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              className="add-to-cart-btn"
              style={{ width: '90%' }}
              onClick={(e) => handleAddToCart(e, product)}
              disabled={product.status === 'out_of_stock'}
              block
            >
              {product.status === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ'}
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
              <div>
                <div className="product-price">
                  <div className="price-main">
                    <Text strong className="discounted-price">
                      {formatPrice(discountedPrice)}đ
                    </Text>
                    {product.discount_price && (
                      <Text delete type="secondary" className="original-price">
                        {formatPrice(product.price)}đ
                      </Text>
                    )}
                  </div>
                  {product.discount_price && (
                    <Text type="danger" className="discount-tag">
                      -{Math.round((1 - product.discount_price/product.price) * 100)}%
                    </Text>
                  )}
                </div>
                {renderProductSpecs(product)}
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
        {(minPrice !== null || maxPrice !== null) && (
          <Text type="secondary">
            {minPrice !== null && maxPrice !== null 
              ? `Giá từ ${formatPrice(minPrice)}đ đến ${formatPrice(maxPrice)}đ` 
              : minPrice !== null 
                ? `Giá từ ${formatPrice(minPrice)}đ trở lên` 
                : `Giá đến ${formatPrice(maxPrice)}đ`}
          </Text>
        )}
      </div>
      <Row gutter={[24, 24]}>
        {products.length > 0 ? (
          products.map(renderProductCard)
        ) : (
          <Col span={24}>
            <div className="no-products">
              <Text>Không tìm thấy sản phẩm phù hợp với bộ lọc</Text>
            </div>
          </Col>
        )}
      </Row>
    </div>
  )

  return (
    <div className="main-content">
      <Banner />
      {loading ? (
        <div>Loading...</div>
      ) : branch ? (
        renderFilteredProducts()
      ) : (
        <>
          {renderProductSection('SẢN PHẨM NỔI BẬT', featuredProducts)}
          {renderProductSection('SẢN PHẨM MỚI', newProducts)}
        </>
      )}
    </div>
  )
}

export default MainContent