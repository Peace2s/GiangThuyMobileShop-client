import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Tabs } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/home.service';
import './Profile.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        address: user.address
      });
    }
  }, [user, form]);

  const onFinishProfile = async (values) => {
    try {
      setLoading(true);
      console.log('Submitting profile update:', values);

      if (!values.fullName || !values.phone) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(values.phone)) {
        message.error('Số điện thoại không hợp lệ');
        return;
      }

      const response = await authService.updateProfile({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address || null
      });
      
      console.log('Update profile response:', response);

      if (response.data.success) {
        updateUser(response.data.user);
        message.success('Cập nhật thông tin thành công');
      } else {
        message.error(response.data.message || 'Cập nhật thông tin thất bại');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response);
      message.error(
        error.response?.data?.message || 
        error.message || 
        'Có lỗi xảy ra khi cập nhật thông tin'
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishPassword = async (values) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(values);
      
      if (response.data.success) {
        message.success('Đổi mật khẩu thành công');
        form.resetFields(['oldPassword', 'newPassword', 'confirmPassword']);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Title level={2} className="profile-title">
          Thông tin cá nhân
        </Title>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin cơ bản" key="1">
            <Form
              form={form}
              name="profile"
              onFinish={onFinishProfile}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập họ và tên!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại!',
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: 'Số điện thoại không hợp lệ!',
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Đổi mật khẩu" key="2">
            <Form
              name="password"
              onFinish={onFinishPassword}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="oldPassword"
                label="Mật khẩu hiện tại"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu hiện tại!',
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu mới!',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận mật khẩu mới!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile; 