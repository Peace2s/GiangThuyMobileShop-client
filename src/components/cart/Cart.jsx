import React from 'react';
import { Table, Button, InputNumber, Typography, Empty, Space, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import './Cart.css';

const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, updateQuantity, getCartTotal, loading, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    await updateQuantity(id, quantity);
  };

  const handleRemoveItem = async (id) => {
    await removeFromCart(id);
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="cart-product">
          <img 
            src={record.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
            alt={name} 
            className="cart-product-image"
          />
          <div className="cart-product-info">
            <Text strong>{name}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong className="current-price">
          {formatPrice(price)}đ
        </Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.stock_quantity || 999}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => (
        <Text strong className="cart-item-total">
          {formatPrice(record.price * record.quantity)}đ
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 64 }} />}
          description="Giỏ hàng trống"
        >
          <Button type="primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Title level={2}>Giỏ hàng của bạn</Title>
      <Table
        columns={columns}
        dataSource={cartItems}
        rowKey={(record) => `${record.id}-${record.selectedColor}`}
        pagination={false}
      />
      
      <div className="cart-summary">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Divider />
          <div className="cart-total">
            <Text strong>Tổng tiền:</Text>
            <Text strong className="total-amount">
              {formatPrice(getCartTotal())}đ
            </Text>
          </div>
          <div className="cart-actions">
            <Button onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </Button>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: '/cart' } });
                } else {
                  navigate('/checkout');
                }
              }}
            >
              Thanh toán
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Cart; 