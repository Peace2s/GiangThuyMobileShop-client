import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, message } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/admin.service';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStatistics();

      setStatistics({
        totalProducts: response.data.totalProducts || 0,
        totalOrders: response.data.totalOrders || 0,
        totalUsers: response.data.totalUsers || 0,
        totalRevenue: response.data.totalRevenue || 0
      });
      setRecentOrders(response.data.recentOrders || []);
      setTopProducts(response.data.topProducts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
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
      render: (status) => {
        const statusMap = {
          pending: 'Chờ xử lý',
          processing: 'Đang xử lý',
          shipped: 'Đang giao',
          delivered: 'Đã giao',
          cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
      }
    },
  ];

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      key: 'sold',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount) => `${parseInt(amount).toLocaleString()} VNĐ`,
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={statistics.totalProducts}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={statistics.totalOrders}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => `${parseInt(value).toLocaleString()} VNĐ`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Đơn hàng gần đây">
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Sản phẩm bán chạy">
            <Table
              dataSource={topProducts}
              columns={productColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 