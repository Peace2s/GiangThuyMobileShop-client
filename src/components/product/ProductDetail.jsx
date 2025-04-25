import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Button, Space, Tag, Select, InputNumber, Tabs, Image, message, Radio, Card } from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { productService } from '../../services/home.service'
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
  const [selectedStorage, setSelectedStorage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fromBranch = location.state?.fromBranch

  // Lấy danh sách các tùy chọn từ productVariants
  const getUniqueOptions = (variants, key) => {
    return [...new Set(variants.map(v => v[key]))];
  };

  // Lấy danh sách các màu sắc tương ứng với dung lượng đã chọn
  const getColorsByStorage = (storage) => {
    if (!product?.productVariants) return [];
    return [...new Set(product.productVariants
      .filter(v => v.storage === storage)
      .map(v => v.color)
    )];
  };

  // Tìm biến thể phù hợp nhất với các lựa chọn hiện tại
  const findBestMatchingVariant = (newValue, key) => {
    if (!product?.productVariants) return null;

    // Tạo object chứa các lựa chọn hiện tại
    const currentSelections = {
      color: selectedColor,
      storage: selectedStorage,
      [key]: newValue
    };

    // Tìm biến thể khớp hoàn toàn
    let matchingVariant = product.productVariants.find(v => 
      v.color === currentSelections.color && 
      v.storage === currentSelections.storage
    );

    // Nếu không tìm thấy, lấy biến thể đầu tiên có giá trị mới
    if (!matchingVariant) {
      matchingVariant = product.productVariants.find(v => v[key] === newValue);
    }

    return matchingVariant;
  };

  // Xử lý khi thay đổi dung lượng
  const handleStorageChange = (storage) => {
    setSelectedStorage(storage);
    // Lấy danh sách màu sắc tương ứng với dung lượng mới
    const availableColors = getColorsByStorage(storage);
    // Nếu màu hiện tại không có trong danh sách màu mới, chọn màu đầu tiên
    if (!availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0] || '');
    }
  };

  // Xử lý khi thay đổi màu sắc
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Tìm biến thể phù hợp với các lựa chọn
  const findMatchingVariant = () => {
    if (!product?.productVariants) return null;
    return product.productVariants.find(v => 
      v.color === selectedColor && 
      v.storage === selectedStorage
    );
  };

  const selectedVariant = findMatchingVariant();

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
        const response = await productService.getProductById(id)
        if (response.data) {
          setProduct(response.data)
          
          // Kiểm tra xem có biến thể đã được lọc từ trang trước không
          const selectedVariantFromState = location.state?.selectedVariant
          if (selectedVariantFromState) {
            setSelectedColor(selectedVariantFromState.color)
            setSelectedStorage(selectedVariantFromState.storage)
          } else if (response.data.productVariants?.length > 0) {
            // Nếu không có biến thể đã lọc, chọn biến thể đầu tiên
            const firstVariant = response.data.productVariants[0]
            setSelectedColor(firstVariant.color)
            setSelectedStorage(firstVariant.storage)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        message.error('Không thể tải thông tin sản phẩm')
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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      message.warning('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    if (selectedVariant.status === 'out_of_stock') {
      message.error('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > selectedVariant.stock_quantity) {
      message.error(`Số lượng vượt quá số lượng còn lại (${selectedVariant.stock_quantity})`);
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: quantity
    });
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
                src={selectedVariant?.image || product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
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
                {selectedVariant && formatPrice(selectedVariant.discount_price || selectedVariant.price)}đ
              </Title>
              {selectedVariant?.discount_price && (
                <Text delete type="secondary" className="original-price">
                  {formatPrice(selectedVariant.price)}đ
                </Text>
              )}
              {selectedVariant?.discount_price && (
                <Tag color="#ff4d4f">
                  -{Math.round((1 - selectedVariant.discount_price/selectedVariant.price) * 100)}%
                </Tag>
              )}
            </div>

            {product?.productVariants && product.productVariants.length > 0 && (
              <div className="variant-section">
                <div className="variant-group">
                  <Title level={5}>Dung lượng</Title>
                  <Space wrap>
                    {getUniqueOptions(product.productVariants, 'storage').map(storage => (
                      <Card
                        key={storage}
                        size="small"
                        className={`storage-card ${selectedStorage === storage ? 'selected' : ''}`}
                        onClick={() => handleStorageChange(storage)}
                      >
                        {storage}
                      </Card>
                    ))}
                  </Space>
                </div>

                <div className="variant-group">
                  <Title level={5}>Màu sắc</Title>
                  <Radio.Group
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    {getColorsByStorage(selectedStorage).map(color => (
                      <Radio.Button key={color} value={color}>
                        {color}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>

                {selectedVariant && (
                  <div className="variant-details">
                    <Space direction="vertical">
                      <Text>Số lượng còn lại: {selectedVariant.stock_quantity}</Text>
                      <Text>Trạng thái: {selectedVariant.status === 'in_stock' ? 'Còn hàng' : 'Hết hàng'}</Text>
                    </Space>
                  </div>
                )}
              </div>
            )}

            <div className="quantity-section">
              <Title level={5}>Số lượng</Title>
              <InputNumber
                min={1}
                max={selectedVariant?.stock_quantity || 1}
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
                disabled={!selectedVariant || selectedVariant.status === 'out_of_stock'}
              >
                {selectedVariant?.status === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
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