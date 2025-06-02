import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { adminService } from "../../services/admin.service";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllBrands();
      console.log("Brands response:", response); // Debug log
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error); // Debug log
      message.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteBrand(deleteId);
      message.success("Xóa thương hiệu thành công");
      fetchBrands();
    } catch (error) {
      message.error("Không thể xóa thương hiệu");
    } finally {
      setDeleteModalVisible(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await adminService.updateBrand(editingId, values);
        message.success("Cập nhật thương hiệu thành công");
      } else {
        await adminService.createBrand(values);
        message.success("Thêm thương hiệu thành công");
      }
      setModalVisible(false);
      fetchBrands();
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Mã thương hiệu",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="brands-container">
      <div className="brands-header">
        <h1>Quản lý thương hiệu</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm thương hiệu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Sửa thương hiệu" : "Thêm thương hiệu"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteId(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa thương hiệu này không?</p>
      </Modal>
    </div>
  );
};

export default Brands;
