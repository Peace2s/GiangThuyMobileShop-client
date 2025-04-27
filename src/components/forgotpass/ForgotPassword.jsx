import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../../services/home.service';
import './ForgotPassword.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(values.email);
      
      if (response.data.success) {
        message.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu');
        form.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Card className="forgot-password-card">
        <Title level={2} className="forgot-password-title">
          Quên mật khẩu
        </Title>
        
        <Text type="secondary" className="forgot-password-description">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </Text>

        <Form
          form={form}
          name="forgot-password"
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
              prefix={<MailOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Gửi yêu cầu
            </Button>
          </Form.Item>

          <div className="forgot-password-footer">
            <Link to="/login">
              <Button type="link">Quay lại đăng nhập</Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword; 