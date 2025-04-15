import React from 'react';
import { Table, Button, InputNumber, Typography, Empty, Space, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="cart-product">
          <img 
            src={record.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
            alt={text} 
            className="cart-product-image"
          />
          <div className="cart-product-info">
            <Text strong>{text}</Text>
            {record.selectedColor && (
              <Text type="secondary">Màu: {record.selectedColor}</Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div className="cart-price">
          <Text strong className="current-price">
            {(record.discount_price || price).toLocaleString()}đ
          </Text>
          {record.discount_price && (
            <Text delete type="secondary" className="original-price">
              {price.toLocaleString()}đ
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.stock_quantity}
          value={quantity}
          onChange={(value) => updateQuantity(record.id, record.selectedColor, value)}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => (
        <Text strong className="cart-item-total">
          {((record.discount_price || record.price) * record.quantity).toLocaleString()}đ
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
          onClick={() => removeFromCart(record.id, record.selectedColor)}
        />
      ),
    },
  ];

  if (cartItems.length === 0) {
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
              {getCartTotal().toLocaleString()}đ
            </Text>
          </div>
          <div className="cart-actions">
            <Button onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </Button>
            <Button type="primary" size="large">
              Thanh toán
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Cart; 