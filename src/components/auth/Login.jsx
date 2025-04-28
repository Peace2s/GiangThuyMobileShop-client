import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { mergeCartWithServer } = useCart();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      
      if (result.success) {
        try {
          await mergeCartWithServer();
          message.success('Đăng nhập thành công!');
          const from = location.state?.from || '/';
          navigate(from);
        } catch (mergeError) {
          console.error('Error merging cart:', mergeError);
          message.success('Đăng nhập thành công!');
          const from = location.state?.from || '/';
          navigate(from);
        }
      } else {
        message.error(result.message);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <Button 
        icon={<HomeOutlined />} 
        onClick={goToHome}
        type="dashed"
        className="home-button"
      >
        Trang chủ
      </Button>

      <Card className="login-card">
        <Title level={2} className="login-title">
          Đăng nhập
        </Title>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!',
              },
              {
                type: 'email',
                message: 'Email không hợp lệ!',
              },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
              {
                min: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-footer">
            <Link to="/forgot-password">
              <Button type="link">Quên mật khẩu?</Button>
            </Link>
          </div>

          <Divider>
            <Text type="secondary">hoặc</Text>
          </Divider>

          <div className="login-footer">
            <Text>Chưa có tài khoản?</Text>
            <Link to="/register">
              <Button type="link">Đăng ký ngay</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 