import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, Select, message, DatePicker, Input, Space, Statistic, Row, Col } from 'antd';
import { adminService } from '../../services/admin.service';
import './Orders.css';

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
    total: 0
  });
  const [filters, setFilters] = useState({
    status: undefined,
    search: '',
    startDate: null,
    endDate: null
  });
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusCounts: []
  });

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const { status, search } = filters;
      
      const response = await adminService.getOrders({
        page: current,
        limit: pageSize,
        status,
        search
      });
      
      setOrders(response.data.orders);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { startDate, endDate } = filters;
      const response = await adminService.getOrderStatistics({
        startDate: startDate?.format('YYYY-MM-DD'),
        endDate: endDate?.format('YYYY-MM-DD')
      });
      
      // Validate response data
      if (response.data) {
        setStatistics({
          totalOrders: response.data.totalOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          statusCounts: response.data.orders || []
        });
      } else {
        setStatistics({
          totalOrders: 0,
          totalRevenue: 0,
          statusCounts: []
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Không thể tải thống kê');
      setStatistics({
        totalOrders: 0,
        totalRevenue: 0,
        statusCounts: []
      });
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, { status });
      message.success('Cập nhật trạng thái thành công');
      fetchOrders();
      fetchStatistics();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
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
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters(prev => ({
      ...prev,
      startDate: dates?.[0],
      endDate: dates?.[1]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'full_name'],
      key: 'user',
      render: (_, record) => record.user?.full_name || 'Không xác định'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${parseInt(amount).toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetails(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic title="Tổng số đơn hàng" value={statistics.totalOrders || 0} />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Tổng doanh thu" 
            value={statistics.totalRevenue || 0} 
            formatter={value => `${value.toLocaleString()} VNĐ`}
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Đơn hàng đã giao" 
            value={statistics.statusCounts?.find(s => s.status === 'delivered')?.count || 0} 
          />
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo mã đơn hoặc địa chỉ"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
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
      </Space>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={pagination}
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
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đơn hàng" span={1}>{selectedOrder.id}</Descriptions.Item>
            <Descriptions.Item label="Ngày đặt" span={1}>
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng" span={1}>{selectedOrder.user?.full_name}</Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>{selectedOrder.user?.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={1}>{selectedOrder.user?.phone}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={1}>{selectedOrder.shippingAddress}</Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán" span={1}>
              {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
              <Tag color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status === 'pending' && 'Chờ xử lý'}
                {selectedOrder.status === 'processing' && 'Đang xử lý'}
                {selectedOrder.status === 'shipped' && 'Đang giao'}
                {selectedOrder.status === 'delivered' && 'Đã giao'}
                {selectedOrder.status === 'cancelled' && 'Đã hủy'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm" span={2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedOrder.OrderItems?.map((item) => (
                  <div key={item.id} style={{ 
                    padding: '12px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: '4px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
                        <div style={{ color: '#666', marginTop: '4px' }}>
                          {item.productVariant?.color && `Màu: ${item.productVariant.color}`}
                          {item.productVariant?.storage && ` - Dung lượng: ${item.productVariant.storage}`}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{parseInt(item.price).toLocaleString()} VNĐ</div>
                        <div style={{ color: '#666' }}>x {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ 
                      textAlign: 'right', 
                      fontWeight: 500, 
                      color: '#1890ff',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: '8px'
                    }}>
                      Thành tiền: {(parseInt(item.price) * item.quantity).toLocaleString()} VNĐ
                    </div>
                  </div>
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              {parseInt(selectedOrder.totalAmount).toLocaleString()} VNĐ
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Orders; 