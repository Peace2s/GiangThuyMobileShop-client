import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, Select, message, Popconfirm, Input } from 'antd';
import { adminService } from '../../services/admin.service';
import './Users.css';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      if (response.data && response.data.users) {

        const formattedUsers = response.data.users.map(user => ({
          ...user,
          key: user.id,
          name: user.fullName 
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUser(userId, { role });
      message.success('Cập nhật vai trò thành công');
      fetchUsers();
    } catch (error) {
      message.error('Cập nhật vai trò thất bại');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Xóa người dùng thất bại');
    }
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'user':
        return 'blue';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await adminService.updateUser(userId, { status });
      message.success('Cập nhật trạng thái thành công');
      fetchUsers();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleNameChange = async (userId, name) => {
    try {
      await adminService.updateUser(userId, { fullName: name });
      message.success('Cập nhật tên thành công');
      fetchUsers();
      setEditingKey('');
    } catch (error) {
      message.error('Cập nhật tên thất bại');
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            defaultValue={text}
            onPressEnter={(e) => handleNameChange(record.id, e.target.value)}
            onBlur={(e) => handleNameChange(record.id, e.target.value)}
          />
        ) : (
          <div
            className="editable-cell"
            onClick={() => setEditingKey(record.id)}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record.id, value)}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Đã khóa</Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="user-actions">
          <Button 
            type="link" 
            onClick={() => showUserDetails(record)}
            style={{ padding: '4px 15px' }}
          >
            Chi tiết
          </Button>
          {record.role !== 'admin' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                type="link" 
                danger
                style={{ padding: '4px 15px' }}
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Quản lý người dùng</h1>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chi tiết người dùng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{selectedUser.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={getRoleColor(selectedUser.role)}>
                {selectedUser.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.phone || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedUser.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Users; 