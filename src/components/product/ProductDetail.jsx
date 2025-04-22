import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Button, Space, Rate, Tag, Radio, InputNumber, Tabs, Image, message } from 'antd'
import { ShoppingCartOutlined, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { productService } from '../../services/api'
import { useCart } from '../../contexts/CartContext'
import './ProductDetail.css'

const { Title, Text } = Typography
const { TabPane } = Tabs

// Hàm định dạng số với dấu chấm phân cách hàng nghìn
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ProductDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fromBranch = location.state?.fromBranch

  const handleBack = () => {
    if (fromBranch) {
      navigate(`/?branch=${fromBranch}`)
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Try to get product from location state first (when navigating from MainContent)
        const productFromState = location.state?.product
        if (productFromState) {
          setProduct(productFromState)
          setSelectedColor(productFromState.colors?.[0]?.code || '')
        } else {
          // If not available in state, fetch from API
          const response = await productService.getProductById(id)
          if (response.data) {
            setProduct(response.data)
            setSelectedColor(response.data.colors?.[0]?.code || '')
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, location.state])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const discountedPrice = product.discount_price || product.price

  const handleAddToCart = () => {
    if (product.status === 'out_of_stock') {
      message.error('Sản phẩm đã hết hàng');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      message.warning('Vui lòng chọn màu sắc');
      return;
    }

    addToCart(product, quantity, selectedColor);
  }

  return (
    <div className="product-detail">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        className="back-button"
      >
        Quay lại
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div className="product-gallery">
            <div className="main-image">
              <Image
                src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                alt={product.name}
                preview={false}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="product-info">
            <Title level={3}>{product.name}</Title>

            <div className="price-section">
              <Title level={2} className="discounted-price">
                {formatPrice(discountedPrice)}đ
              </Title>
              {product.discount_price && (
                <Text delete type="secondary" className="original-price">
                  {formatPrice(product.price)}đ
                </Text>
              )}
              {product.discount_price && (
                <Tag color="#ff4d4f">
                  -{Math.round((1 - product.discount_price/product.price) * 100)}%
                </Tag>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="color-section">
                <Title level={5}>Màu sắc</Title>
                <Radio.Group value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                  <Space wrap>
                    {product.colors.map(color => (
                      <Radio.Button
                        key={color.code}
                        value={color.code}
                        className="color-option"
                        style={{ '--color': color.code }}
                      >
                        {color.name}
                      </Radio.Button>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            )}

            <div className="quantity-section">
              <Title level={5}>Số lượng</Title>
              <InputNumber
                min={1}
                max={product.stock_quantity || 10}
                value={quantity}
                onChange={setQuantity}
              />
              <Text type="secondary" style={{ marginLeft: 10 }}>
                Còn lại: {product.stock_quantity || 0} sản phẩm
              </Text>
            </div>

            <div className="action-section">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
              >
                {product.status === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <div className="product-tabs">
        <Tabs defaultActiveKey="specs">
          <TabPane tab="Thông số kỹ thuật" key="specs">
            <div className="specifications">
              {product.screen && (
                <div className="spec-item">
                  <Text strong>Màn hình:</Text>
                  <Text>{product.screen}</Text>
                </div>
              )}
              {product.processor && (
                <div className="spec-item">
                  <Text strong>Chip:</Text>
                  <Text>{product.processor}</Text>
                </div>
              )}
              {product.ram && (
                <div className="spec-item">
                  <Text strong>RAM:</Text>
                  <Text>{product.ram}</Text>
                </div>
              )}
              {product.storage && (
                <div className="spec-item">
                  <Text strong>Bộ nhớ:</Text>
                  <Text>{product.storage}</Text>
                </div>
              )}
              {product.camera && (
                <div className="spec-item">
                  <Text strong>Camera:</Text>
                  <Text>{product.camera}</Text>
                </div>
              )}
              {product.battery && (
                <div className="spec-item">
                  <Text strong>Pin:</Text>
                  <Text>{product.battery}</Text>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab="Mô tả sản phẩm" key="description">
            <div className="product-description">
              <Text>{product.description}</Text>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductDetail 