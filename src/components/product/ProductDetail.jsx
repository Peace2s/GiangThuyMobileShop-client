import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Row, Col, Typography, Button, Space, Rate, Tag, Radio, InputNumber, Tabs, Image } from 'antd'
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { getProductById } from '../../data/mockData'
import './ProductDetail.css'

const { Title, Text } = Typography
const { TabPane } = Tabs

const ProductDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    // Try to get product from location state first (when navigating from MainContent)
    const productFromState = location.state?.product
    if (productFromState) {
      setProduct(productFromState)
      setSelectedColor(productFromState.colors[0]?.code || '')
    } else {
      // If not available in state, fetch from mockData
      const fetchedProduct = getProductById(id)
      if (fetchedProduct) {
        setProduct(fetchedProduct)
        setSelectedColor(fetchedProduct.colors[0]?.code || '')
      }
    }
  }, [id, location.state])

  if (!product) {
    return <div>Loading...</div>
  }

  const discountedPrice = product.price * (1 - product.discount / 100)

  const handleAddToCart = () => {
    console.log('Add to cart:', {
      product,
      color: selectedColor,
      quantity
    })
  }

  return (
    <div className="product-detail">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div className="product-gallery">
            <div className="main-image">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                preview={false}
              />
            </div>
            <div className="thumbnail-list">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="product-info">
            <Title level={3}>{product.name}</Title>

            <div className="price-section">
              <Title level={2} className="discounted-price">
                {discountedPrice.toLocaleString()}đ
              </Title>
              <Text delete type="secondary" className="original-price">
                {product.price.toLocaleString()}đ
              </Text>
              <Tag color="#ff4d4f">-{product.discount}%</Tag>
            </div>

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

            <div className="quantity-section">
              <Title level={5}>Số lượng</Title>
              <InputNumber
                min={1}
                max={10}
                value={quantity}
                onChange={setQuantity}
              />
            </div>

            <div className="action-section">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <div className="product-tabs">
        <Tabs defaultActiveKey="specs">
          <TabPane tab="Thông số kỹ thuật" key="specs">
            <div className="specifications">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <Text strong>{key}:</Text>
                  <Text>{value}</Text>
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Mô tả sản phẩm" key="description">
            <div className="product-description">
              <Text>
                Sản phẩm được tạo vào: {new Date(product.createdAt).toLocaleDateString()}
              </Text>
              <br />
              <Text>
                Cập nhật lần cuối: {new Date(product.updatedAt).toLocaleDateString()}
              </Text>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductDetail 