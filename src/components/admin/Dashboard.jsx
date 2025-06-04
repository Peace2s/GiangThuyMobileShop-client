import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, message, DatePicker, Select, Space } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/admin.service';
import './Dashboard.css';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Option } = Select;

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
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const currentYear = new Date().getFullYear();
    return [
      dayjs(`${currentYear}-01-01`),
      dayjs(`${currentYear}-12-31`)
    ];
  });
  const [groupBy, setGroupBy] = useState('month');
  const [revenueData, setRevenueData] = useState({
    data: [],
    totalRevenue: 0,
    startDate: null,
    endDate: null,
    groupBy: 'day'
  });

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueData();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchRevenueData();
    }
  }, [dateRange, groupBy]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statisticsResponse, monthlyRevenueResponse] = await Promise.all([
        adminService.getStatistics(),
        adminService.getMonthlyRevenue()
      ]);

      setStatistics(statisticsResponse.data);
      setRecentOrders(statisticsResponse.data.recentOrders || []);
      setTopProducts(statisticsResponse.data.topProducts || []);
      setMonthlyRevenue(Array.isArray(monthlyRevenueResponse.data) ? monthlyRevenueResponse.data : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      const response = await adminService.getRevenueByDateRange(startDate, endDate, groupBy);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      message.error('Không thể tải dữ liệu doanh thu');
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

  const chartData = {
    labels: revenueData.data.map(item => item.date),
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData.data.map(item => item.revenue),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${parseInt(context.raw).toLocaleString()} VNĐ`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `${parseInt(value).toLocaleString()} VNĐ`;
          }
        }
      }
    }
  };

  const handleGroupByChange = (value) => {
    setGroupBy(value);
    
    if (value === 'year' && dateRange[0] && dateRange[1]) {
      setDateRange([
        dayjs(dateRange[0].format('YYYY-01-01')),
        dayjs(dateRange[1].format('YYYY-12-31'))
      ]);
    }
  };

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
        <Col xs={24}>
          <Card 
            title="Thống kê doanh thu"
            extra={
              <Space>
                <RangePicker
                  onChange={(dates) => setDateRange(dates)}
                  value={dateRange}
                  allowClear={false}
                  picker={groupBy === 'year' ? 'year' : 'date'}
                />
                <Select 
                  value={groupBy} 
                  onChange={handleGroupByChange}
                  style={{ width: 120 }}
                >
                  <Option value="day">Theo ngày</Option>
                  <Option value="month">Theo tháng</Option>
                  <Option value="year">Theo năm</Option>
                </Select>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Tổng doanh thu trong khoảng thời gian"
                value={revenueData.totalRevenue}
                prefix={<DollarOutlined />}
                formatter={(value) => `${parseInt(value).toLocaleString()} VNĐ`}
              />
            </div>
            <Line data={chartData} options={chartOptions} />
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