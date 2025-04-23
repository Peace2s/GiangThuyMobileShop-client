import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Upload, message, Image, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { adminService } from '../../services/admin.service';
import { cloudinaryService } from '../../services/cloudinary.service';
import './Products.css';

const { TextArea } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProducts();
      setProducts(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setImageUrl('');
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      discount_price: record.discount_price,
      description: record.description,
      stock_quantity: record.stock_quantity,
      status: record.status,
      brand: record.brand,
      storage: record.storage,
      screen: record.screen,
      processor: record.processor,
      ram: record.ram,
      camera: record.camera,
      battery: record.battery,
    });
    setImageUrl(record.image);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProduct(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      message.error('Không thể xóa sản phẩm');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const url = await cloudinaryService.uploadImage(file);
      setImageUrl(url);
      message.success('Tải ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Có lỗi khi tải ảnh');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      const productData = {
        ...values,
        image: imageUrl
      };
      
      if (editingId) {
        await adminService.updateProduct(editingId, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await adminService.createProduct(productData);
        message.success('Thêm sản phẩm thành công');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          src={image}
          alt="product"
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'discount_price',
      key: 'discount_price',
      render: (price) => price ? `${price.toLocaleString()} VNĐ` : '-',
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status === 'in_stock' ? 'Còn hàng' : 'Hết hàng',
    },
    {
      title: 'Thao tác',
      key: 'action',
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
    <div className="products-container">
      <div className="products-header">
        <h1>Quản lý sản phẩm</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="discount_price"
            label="Giá khuyến mãi"
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="in_stock">Còn hàng</Option>
              <Option value="out_of_stock">Hết hàng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
          >
            <Select>
              <Option value="apple">Apple</Option>
              <Option value="samsung">Samsung</Option>
              <Option value="xiaomi">Xiaomi</Option>
              <Option value="oppo">OPPO</Option>
              <Option value="vivo">Vivo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="storage"
            label="Bộ nhớ trong"
            rules={[{ required: true, message: 'Vui lòng nhập bộ nhớ trong' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="screen"
            label="Màn hình"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin màn hình' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="processor"
            label="Chip xử lý"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin chip xử lý' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ram"
            label="RAM"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin RAM' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="camera"
            label="Camera"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin camera' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="battery"
            label="Pin"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin pin' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            valuePropName="fileList"
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
              disabled={uploading}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : uploading ? (
                <div>
                  <LoadingOutlined />
                  <div style={{ marginTop: 8 }}>Đang tải lên...</div>
                </div>
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products; 