import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';
import { Form, Input, Select, Button, Card, Typography, Divider, Space } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        phone: user.phone || '',
        fullName: user.fullName || ''
      });
    }
  }, [user, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const orderData = {
        shippingAddress: values.address,
        paymentMethod: values.paymentMethod,
        note: values.note || '',
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor
        })),
        totalAmount: getCartTotal()
      };

      await orderService.createOrder(orderData);
      await clearCart();
      toast.success('Đặt hàng thành công!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể đặt hàng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-empty">
        <Card>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Title level={4}>Vui lòng đăng nhập để thanh toán</Title>
            <Button type="primary" onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
              Đăng nhập
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <Card>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <ShoppingOutlined style={{ fontSize: 64 }} />
            <Title level={4}>Giỏ hàng trống</Title>
            <Button type="primary" onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Title level={2}>Thanh toán</Title>
      <div className="checkout-content">
        <div className="checkout-form">
          <Card title="Thông tin giao hàng">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                paymentMethod: 'cod'
              }}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ giao hàng"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
              >
                <TextArea rows={3} placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
              >
                <Select>
                  <Select.Option value="cod">Thanh toán khi nhận hàng (COD)</Select.Option>
                  <Select.Option value="bank">Chuyển khoản ngân hàng</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="note"
                label="Ghi chú"
              >
                <TextArea rows={3} placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đặt hàng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div className="checkout-summary">
          <Card title="Thông tin đơn hàng">
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-info">
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">
                      {Number(item.price).toLocaleString()}đ x {item.quantity}
                    </Text>
                  </div>
                  <Text strong>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </Text>
                </div>
              ))}
            </div>
            <Divider />
            <div className="order-total">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className="total-row">
                  <Text>Tạm tính:</Text>
                  <Text>{getCartTotal().toLocaleString()}đ</Text>
                </div>
                <div className="total-row">
                  <Text>Phí vận chuyển:</Text>
                  <Text>0đ</Text>
                </div>
                <Divider />
                <div className="total-row">
                  <Text strong>Tổng cộng:</Text>
                  <Text strong>{getCartTotal().toLocaleString()}đ</Text>
                </div>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 