import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Typography, Card, message, Image, Modal, Descriptions, Divider } from 'antd';
import { orderService } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import './Orders.css';

const { Title, Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      await orderService.cancelOrder(orderId);
      message.success('Hủy đơn hàng thành công');
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'gold',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusText[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      bank: 'Chuyển khoản ngân hàng',
      momo: 'Ví điện tử MoMo'
    };
    return methods[method] || method;
  };

  const renderOrderItems = (items) => {
    if (!items || !Array.isArray(items)) return null;
    
    return (
      <ul className="order-items-list">
        {items.map((item, index) => {
          if (!item || !item.product) {
            return <li key={index}>Sản phẩm không xác định</li>;
          }
          
          return (
            <li key={index} className="order-item">
              <Image 
                src={item.product.image} 
                alt={item.product.name}
                width={50}
                height={50}
                className="product-image"
              />
              <div className="product-info">
                <span className="product-name">{item.product.name}</span>
                <div className="product-details">
                  <span>Số lượng: {item.quantity}</span>
                  <span>Giá: {formatCurrency(item.price)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <span>#{id}</span>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'OrderItems',
      key: 'products',
      render: renderOrderItems
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (amount) => formatCurrency(amount || 0)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button 
              type="text" 
              danger 
              onClick={() => handleCancelOrder(record.id)}
              loading={cancellingOrderId === record.id}
            >
              Hủy đơn
            </Button>
          )}
          <Button 
            type="link" 
            onClick={() => showOrderDetails(record)}
          >
            Chi tiết
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="orders-container">
      <Card>
        <Title level={2}>Đơn hàng của tôi</Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            position: ['bottomCenter'],
            showSizeChanger: false
          }}
        />
      </Card>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="order-details">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã đơn hàng">
                #{selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {getPaymentMethodText(selectedOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={selectedOrder.paymentStatus === 'paid' ? 'green' : 'gold'}>
                  {selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú">
                  {selectedOrder.note}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Sản phẩm</Divider>
            <div className="order-items-details">
              {selectedOrder.OrderItems.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="product-image"
                  />
                  <div className="product-info">
                    <Text strong>{item.product.name}</Text>
                    <div className="product-details">
                      <span>Số lượng: {item.quantity}</span>
                      <span>Đơn giá: {formatCurrency(item.price)}</span>
                      <span>Thành tiền: {formatCurrency(item.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Divider />
            <div className="order-total">
              <Text strong>Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders; 