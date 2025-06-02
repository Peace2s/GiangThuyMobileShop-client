import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Select,
  message,
  DatePicker,
  Input,
  Space,
  Statistic,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { adminService } from "../../services/admin.service";
import "./OrdersAdmin.css";
import * as XLSX from "xlsx";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: undefined,
    paymentStatus: undefined,
    search: "",
    startDate: null,
    endDate: null,
  });
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusCounts: [],
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const { status, search, startDate, endDate } = filters;

      const response = await adminService.getOrders({
        page: current,
        limit: pageSize,
        status,
        search,
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
      });

      setOrders(response.data.orders);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error) {
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, { status });
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaymentStatusFilter = (value) => {
    setFilters((prev) => ({ ...prev, paymentStatus: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dates?.[0],
      endDate: dates?.[1],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng",
      vnpay: "Thanh toán qua VNPay",
      qr_sepay: "Thanh toán qua QR",
    };
    return methods[method] || method;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "paid":
        return "green";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return status;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Khách hàng",
      dataIndex: ["user", "full_name"],
      key: "user",
      render: (_, record) => record.user?.full_name || "Không xác định",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${parseInt(amount).toLocaleString()} VNĐ`,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => getPaymentMethodText(method),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đang giao</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetails(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const exportToExcel = () => {
    try {
      const exportData = orders.map((order) => ({
        "Mã đơn hàng": order.id,
        "Tên khách hàng": order.user?.full_name || "",
        Email: order.user?.email || "",
        "Số điện thoại": order.user?.phone || "",
        "Địa chỉ": order.shippingAddress || "",
        "Tổng tiền": order.totalAmount?.toLocaleString("vi-VN") + " VNĐ",
        "Phương thức thanh toán": getPaymentMethodText(order.paymentMethod),
        "Trạng thái thanh toán": getPaymentStatusText(order.paymentStatus),
        "Trạng thái đơn hàng": getStatusText(order.status),
        "Ngày đặt": new Date(order.createdAt).toLocaleString("vi-VN"),
        "Ghi chú": order.note || "",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");

      const wscols = [
        { wch: 10 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 40 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
      ];
      ws["!cols"] = wscols;

      XLSX.writeFile(
        wb,
        `Danh_sach_don_hang_${new Date().toLocaleDateString("vi-VN")}.xlsx`
      );
      message.success("Xuất file Excel thành công");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      message.error("Không thể xuất file Excel");
    }
  };

  return (
    <div className="ordersadmin-container">
      <div className="orders-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo mã đơn hoặc địa chỉ"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái đơn hàng"
          style={{ width: 150 }}
          onChange={handleStatusFilter}
          allowClear
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="processing">Đang xử lý</Option>
          <Option value="shipped">Đang giao</Option>
          <Option value="delivered">Đã giao</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
        <RangePicker onChange={handleDateRangeChange} />
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
        >
          Xuất Excel
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} đơn hàng`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Chi tiết đơn hàng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng" span={1}>
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt" span={1}>
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={1}>
                {selectedOrder.user?.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={1}>
                {selectedOrder.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={1}>
                {selectedOrder.user?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={1}>
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán" span={1}>
                {getPaymentMethodText(selectedOrder.paymentMethod)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán" span={1}>
                <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                  {getPaymentStatusText(selectedOrder.paymentStatus)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng" span={1}>
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status === "pending" && "Chờ xử lý"}
                  {selectedOrder.status === "processing" && "Đang xử lý"}
                  {selectedOrder.status === "shipped" && "Đang giao"}
                  {selectedOrder.status === "delivered" && "Đã giao"}
                  {selectedOrder.status === "cancelled" && "Đã hủy"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: "24px" }}>
              <h3 style={{ marginBottom: "16px" }}>Danh sách sản phẩm</h3>
              <Table
                dataSource={selectedOrder.OrderItems}
                pagination={false}
                columns={[
                  {
                    title: "Sản phẩm",
                    dataIndex: "product",
                    key: "product",
                    render: (_, record) => (
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {record.product?.name}
                        </div>
                        <div style={{ color: "#666", marginTop: "4px" }}>
                          {record.productVariant?.color &&
                            `Màu: ${record.productVariant.color}`}
                          {record.productVariant?.storage &&
                            ` - Dung lượng: ${record.productVariant.storage}`}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "price",
                    key: "price",
                    align: "right",
                    render: (price) =>
                      `${parseInt(price).toLocaleString()} VNĐ`,
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                  },
                  {
                    title: "Thành tiền",
                    key: "total",
                    align: "right",
                    render: (_, record) =>
                      `${(
                        parseInt(record.price) * record.quantity
                      ).toLocaleString()} VNĐ`,
                  },
                ]}
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#fafafa",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontWeight: 500, fontSize: "16px" }}>
                  Tổng tiền:{" "}
                  {parseInt(selectedOrder.totalAmount).toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;

