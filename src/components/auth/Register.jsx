import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/home.service';
import './Register.css';

const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.register(values);

      if (response.data) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="register-container">
      <Button
        icon={<HomeOutlined />}
        onClick={goToHome}
        type="dashed"
        className="home-button"
      >
        Trang chủ
      </Button>

      <Card className="register-card">
        <Title level={2} className="register-title">
          Đăng ký tài khoản
        </Title>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập họ tên!',
              },
              {
                min: 2,
                message: 'Họ tên phải có ít nhất 2 ký tự!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
            />
          </Form.Item>

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
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: false,
              },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Địa chỉ"
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
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary">hoặc</Text>
          </Divider>

          <div className="register-footer">
            <Text>Đã có tài khoản?</Text>
            <Link to="/login">
              <Button type="link">Đăng nhập ngay</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 