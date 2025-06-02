import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Card,
  message,
  Image,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import { orderService } from "../../services/home.service";
import { formatCurrency } from "../../utils/format";
import "./Orders.css";

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
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      await orderService.cancelOrder(orderId);
      message.success("Hủy đơn hàng thành công");
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể hủy đơn hàng");
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
      pending: "gold",
      processing: "blue",
      shipped: "cyan",
      delivered: "green",
      cancelled: "red",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusText = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return statusText[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng",
      vnpay: "Thanh toán qua VNPay",
      qr_sepay: "Thanh toán qua QR",
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

  const renderOrderDetails = (order) => {
    if (!order) return null;

    const productColumns = [
      {
        title: "Sản phẩm",
        dataIndex: "product",
        key: "product",
        render: (_, record) => (
          <div className="product-info">
            <Image
              src={record.product.image}
              alt={record.product.name}
              width={50}
              height={50}
              className="product-image"
            />
            <Text strong>{record.product.name}</Text>
          </div>
        ),
      },
      {
        title: "Dung lượng",
        dataIndex: "storage",
        key: "storage",
        width: 120,
        align: "center",
        render: (_, record) =>
          record.productVariant ? (
            <Text>{record.productVariant.storage}</Text>
          ) : null,
      },
      {
        title: "Màu sắc",
        dataIndex: "color",
        key: "color",
        width: 120,
        align: "center",
        render: (_, record) =>
          record.productVariant ? (
            <Text>{record.productVariant.color}</Text>
          ) : null,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 100,
        align: "center",
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        width: 150,
        align: "right",
        render: (price) => formatCurrency(price),
      },
      {
        title: "Thành tiền",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 150,
        align: "right",
        render: (price) => formatCurrency(price),
      },
    ];

    return (
      <div className="order-details">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã đơn hàng">#{order.id}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {getPaymentMethodText(order.paymentMethod)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            <Tag color={order.paymentStatus === "paid" ? "green" : "gold"}>
              {order.paymentStatus === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng">
            {order.shippingAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{order.note}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Sản phẩm</Divider>
        <Table
          columns={productColumns}
          dataSource={order.OrderItems}
          rowKey="id"
          pagination={false}
        />

        <Divider />
        <div className="order-total" style={{ textAlign: "right" }}>
          <Text strong>Tổng cộng: {formatCurrency(order.totalAmount)}</Text>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Sản phẩm",
      dataIndex: "OrderItems",
      key: "products",
      render: renderOrderItems,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount) => formatCurrency(amount || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          {record.status === "pending" && (
            <Button
              type="text"
              danger
              onClick={() => handleCancelOrder(record.id)}
              loading={cancellingOrderId === record.id}
            >
              Hủy đơn
            </Button>
          )}
          <Button type="link" onClick={() => showOrderDetails(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
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
            position: ["bottomCenter"],
            showSizeChanger: false,
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
        {renderOrderDetails(selectedOrder)}
      </Modal>
    </div>
  );
};

export default Orders;

