import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/home.service';
import { message } from 'antd';
import { Form, Input, Select, Button, Card, Typography, Divider, Space, Modal } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import API_URL from '../../config/api';
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const modalShownRef = useRef(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        phone: user.phone || '',
        fullName: user.fullName || '',
        address: user.address || ''
      });
    }
  }, [user, form]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const messageText = params.get('message');

    if (status && messageText && !modalShownRef.current) {
      modalShownRef.current = true;
      
      if (status === 'success') {
        message.success(messageText);
        clearCart();
        navigate('/orders');
      } else {
        message.error(messageText);
        navigate('/checkout');
      }
    }
  }, [location, clearCart, navigate]);

  useEffect(() => {
    if (qrModalVisible && currentOrderId) {
      // Connect to Socket.IO server
      socketRef.current = io(API_URL.replace('/api', ''), {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      // Join order room
      socketRef.current.emit('joinOrderRoom', currentOrderId);

      // Listen for payment status updates
      socketRef.current.on('paymentStatusUpdate', (data) => {
        console.log('Received payment status update:', data);
        setPaymentStatus(data.status);

        if (data.status === 'paid') {
          setQrModalVisible(false);
          clearCart();
          message.success(data.message);
          navigate('/orders');
        } else if (data.status === 'failed') {
          setQrModalVisible(false);
          message.error(data.message);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [qrModalVisible, currentOrderId, clearCart, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const orderData = {
        shippingAddress: values.address,
        paymentMethod: values.paymentMethod,
        note: values.note || '',
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.productVariant?.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal()
      };

      if (values.paymentMethod === 'vnpay') {
        const response = await orderService.createPaymentUrl(orderData);
        window.location.href = response.data.paymentUrl;
        return;
      }

      if (values.paymentMethod === 'qr_sepay') {
        const response = await orderService.createOrder(orderData);
        console.log('Created order:', response.data);
        const orderId = response.data.orderId;
        setCurrentOrderId(orderId);
        const qrUrl = `https://qr.sepay.vn/img?acc=0941076269&bank=VPBank&amount=2000&des=Thanh toan don hang ${orderId}`;
        setQrUrl(qrUrl);
        setQrModalVisible(true);
        return;
      }

      await orderService.createOrder(orderData);
      await clearCart();
      message.success('Đặt hàng thành công!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể đặt hàng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQrModalCancel = async () => {
    try {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      if (currentOrderId) {
        const response = await orderService.cancelSepayOrder(currentOrderId);
        console.log('Cancel response:', response);
        message.info('Đã hủy thanh toán QR');
      }
      setQrModalVisible(false);
      setCurrentOrderId(null);
      setPaymentStatus('pending');
    } catch (error) {
      console.error('Error canceling order:', error);
      message.error('Có lỗi xảy ra khi hủy thanh toán');
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
          <Card title="Thông tin giao hàng" style={{ height: '100%' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                paymentMethod: 'cod'
              }}
              style={{ maxHeight: 'none', overflow: 'visible' }}
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
                  <Select.Option value="vnpay">Thanh toán qua VNPay</Select.Option>
                  <Select.Option value="qr_sepay">Thanh toán qua QR SEpay</Select.Option>
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
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        {item.product?.name}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                      {item.productVariant?.color && `Màu: ${item.productVariant.color}`}
                      {item.productVariant?.storage && ` - Dung lượng: ${item.productVariant.storage}`}
                    </Text>
                    <Text type="secondary" style={{ display: 'block' }}>
                      {Number(item.price).toLocaleString()}đ x {item.quantity}
                    </Text>
                  </div>
                  <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </Text>
                </div>
              ))}
            </div>
            <Divider />
            <div className="order-total">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className="total-row">
                  <Text>Tổng tiền hàng:</Text>
                  <Text>{getCartTotal().toLocaleString()}đ</Text>
                </div>
                <Divider />
                <div className="total-row">
                  <Text strong>Tổng thanh toán:</Text>
                  <Text strong type="danger" style={{ fontSize: '18px' }}>
                    {getCartTotal().toLocaleString()}đ
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        title="Quét mã QR để thanh toán"
        open={qrModalVisible}
        onCancel={handleQrModalCancel}
        footer={null}
        width={400}
        maskClosable={false}
        closable={true}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={qrUrl} alt="QR Code" style={{ width: '100%', maxWidth: '300px' }} />
          <p style={{ marginTop: '16px' }}>
            Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán.
            Sau khi thanh toán thành công, đơn hàng sẽ được xử lý tự động.
          </p>
          <p style={{ marginTop: '8px', color: paymentStatus === 'paid' ? '#52c41a' : '#faad14' }}>
            Trạng thái: {paymentStatus === 'paid' ? 'Đã thanh toán' : 'Đang chờ thanh toán...'}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout; 