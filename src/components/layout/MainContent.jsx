import { Typography, Button, Row, Col, Card, Tag, Tooltip, message, Space, Select, InputNumber, Pagination } from 'antd'
import { RightOutlined, MobileOutlined, CameraOutlined, ThunderboltOutlined, DesktopOutlined, FireOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { productService } from '../../services/home.service'
import { useCart } from '../../contexts/CartContext'
import './MainContent.css'
import Banner from './Banner'
import { useState, useEffect } from 'react'

const { Title, Text } = Typography
const { Option } = Select

const formatPrice = (price) => {
  if (!price && price !== 0) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const MainContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const branch = searchParams.get('branch')
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null
  const searchQuery = searchParams.get('q')
  
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    brand: null
  })
  const { addToCart } = useCart()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let response;
        let pageParams = { page: pagination.current, limit: pagination.pageSize };
        if (searchQuery) {
          response = await productService.searchProducts({
            q: searchQuery,
            brand: branch !== 'all' ? branch : undefined,
            minPrice,
            maxPrice,
            page: pagination.current,
            limit: pagination.pageSize
          });
          if (response.data.success) {
            const validProducts = response.data.data.filter(product => 
              product.productVariants?.length > 0 && 
              product.productVariants.some(variant => variant.price)
            );
            setProducts(validProducts);
            setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
          }
        } else if (branch && branch !== 'all') {
          const minPriceValue = minPrice === null ? 0 : minPrice;
          const maxPriceValue = maxPrice === null ? Number.MAX_SAFE_INTEGER : maxPrice;
          response = await productService.getProductsByBrandAndPrice(branch, minPriceValue, maxPriceValue, pageParams)
          const validProducts = response.data.data.filter(product => 
            product.productVariants?.length > 0 && 
            product.productVariants.some(variant => variant.price)
          );
          setProducts(validProducts)
          setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
        } else if (minPrice !== null || maxPrice !== null) {
          response = await productService.getProductsByPrice(minPrice, maxPrice, pageParams)
          const validProducts = response.data.data.filter(product => 
            product.productVariants?.length > 0 && 
            product.productVariants.some(variant => variant.price)
          );
          setProducts(validProducts)
          setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
        } else if (branch === 'all') {
          response = await productService.getAllProducts(pageParams)
          const validProducts = response.data.data.filter(product => 
            product.productVariants?.length > 0 && 
            product.productVariants.some(variant => variant.price)
          );
          setProducts(validProducts)
          setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
        } else {
          const [featuredRes, newRes] = await Promise.all([
            productService.getFeaturedProducts(),
            productService.getNewProducts()
          ])
          const validFeatured = featuredRes.data.filter(product => 
            product.productVariants?.length > 0 && 
            product.productVariants.some(variant => variant.price)
          );
          const validNew = newRes.data.filter(product => 
            product.productVariants?.length > 0 && 
            product.productVariants.some(variant => variant.price)
          );
          setFeaturedProducts(validFeatured)
          setNewProducts(validNew)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        message.error('Không thể tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [branch, minPrice, maxPrice, searchQuery, pagination.current, pagination.pageSize])

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const branchNames = {
    'all': 'Tất cả sản phẩm',
    'apple': 'Apple',
    'samsung': 'Samsung',
    'oppo': 'Oppo',
    'xiaomi': 'Xiaomi',
    'oneplus': 'OnePlus'
  }

  const handleProductClick = (product) => {
    // Tìm biến thể phù hợp với khoảng giá đã lọc
    const matchingVariant = product.productVariants?.find(variant => {
      const price = variant.discount_price || variant.price;
      return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    });

    navigate(`/product/${product.id}`, { 
      state: { 
        product,
        selectedVariant: matchingVariant,
        fromBranch: branch
      } 
    });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    // Lấy biến thể đầu tiên của sản phẩm
    const firstVariant = product.productVariants?.[0];
    if (!firstVariant) {
      message.error('Sản phẩm chưa có biến thể');
      return;
    }
    
    addToCart({
      productId: product.id,
      variantId: firstVariant.id,
      quantity: 1
    });
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
    // Lấy biến thể đầu tiên có giá
    const firstVariant = product.productVariants?.find(variant => variant.price);
    if (!firstVariant) return null;

    const discountedPrice = firstVariant.discount_price || firstVariant.price;
    const originalPrice = firstVariant.price;
    
    return (
      <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
        <Card 
          hoverable 
          cover={<img alt={product.name} src={firstVariant.image || product.image || 'https://via.placeholder.com/300x300?text=No+Image'} width="100%" height="100%" />}
          className="product-card"
          onClick={() => handleProductClick(product)}
          actions={[
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              className="add-to-cart-btn"
              style={{ width: '90%' }}
              onClick={(e) => handleAddToCart(e, product)}
              disabled={firstVariant.status === 'out_of_stock'}
              block
            >
              {firstVariant.status === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ'}
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
                    {firstVariant.discount_price && (
                      <Text delete type="secondary" className="original-price">
                        {formatPrice(originalPrice)}đ
                      </Text>
                    )}
                  </div>
                  {firstVariant.discount_price && (
                    <Text type="danger" className="discount-tag">
                      -{Math.round((1 - firstVariant.discount_price/firstVariant.price) * 100)}%
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
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize }))}
        style={{ marginTop: 24, textAlign: 'center' }}
      />
    </div>
  )

  const renderSearchResults = () => (
    <div className="search-results">
      <div className="section-header">
        <Title level={3}>Kết quả tìm kiếm cho "{searchQuery}"</Title>
        {products && products.length > 0 ? (
          <Text className="search-count">Tìm thấy {pagination.total} sản phẩm</Text>
        ) : null}
        {(branch !== 'all' || minPrice || maxPrice) && (
          <div className="applied-filters">
            <Text type="secondary">
              {branch !== 'all' && `Thương hiệu: ${branchNames[branch]} | `}
              {(minPrice || maxPrice) && `Giá: ${minPrice ? formatPrice(minPrice) : '0'}đ - ${maxPrice ? formatPrice(maxPrice) : 'không giới hạn'}`}
            </Text>
          </div>
        )}
      </div>
      <Row gutter={[24, 24]}>
        {products && products.length > 0 ? (
          products.map(renderProductCard)
        ) : (
          <Col span={24}>
            <div className="no-products">
              <Text>Không tìm thấy sản phẩm phù hợp</Text>
            </div>
          </Col>
        )}
      </Row>
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={(page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize }))}
        style={{ marginTop: 24, textAlign: 'center' }}
      />
    </div>
  )

  return (
    <div className="main-content">
      {!searchQuery && !branch && !minPrice && !maxPrice && <Banner />}
      {loading ? (
        <div>Loading...</div>
      ) : searchQuery ? (
        renderSearchResults()
      ) : branch || minPrice || maxPrice ? (
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