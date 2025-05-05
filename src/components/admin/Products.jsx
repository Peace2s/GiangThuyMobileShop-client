import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Upload, message, Image, Select, Card, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { adminService } from '../../services/admin.service';
import { cloudinaryService } from '../../services/cloudinary.service';
import './Products.css';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [uploadingVariants, setUploadingVariants] = useState({});
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState(undefined);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, [pagination.current, pagination.pageSize, search, brandFilter]);

  const fetchBrands = async () => {
    try {
      const response = await adminService.getAllBrands();
      setBrands(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách thương hiệu');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProducts({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
        brand: brandFilter
      });
      setProducts(response.data.products || response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || (response.data.data ? response.data.data.length : 0)
      }));
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(prev => ({ ...prev, current: pagination.current, pageSize: pagination.pageSize }));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleBrandFilter = (value) => {
    setBrandFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setImageUrl('');
    setVariants([]);
    setModalVisible(true);
  };

  const handleEdit = async (record) => {
    try {
      setEditingId(record.id);
      const response = await adminService.getProductById(record.id);
      const productData = response.data;
      
      form.setFieldsValue({
        name: productData.name,
        description: productData.description,
        brandId: productData.brandId,
        screen: productData.screen,
        processor: productData.processor,
        ram: productData.ram,
        camera: productData.camera,
        battery: productData.battery,
      });
      
      setImageUrl(productData.image);
      setVariants(productData.productVariants || []);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      message.error('Không thể tải thông tin chi tiết sản phẩm');
    }
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

  const handleAddVariant = () => {
    setVariants([...variants, {
      color: '',
      storage: '',
      price: 0,
      discount_price: 0,
      stock_quantity: 0,
      status: 'in_stock',
      image: ''
    }]);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleVariantImageUpload = async (file, index) => {
    try {
      setUploadingVariants(prev => ({ ...prev, [index]: true }));
      const url = await cloudinaryService.uploadImage(file);
      handleVariantChange(index, 'image', url);
      message.success('Tải ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Có lỗi khi tải ảnh');
    } finally {
      setUploadingVariants(prev => ({ ...prev, [index]: false }));
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      if (variants.length === 0) {
        message.error('Sản phẩm phải có ít nhất một phiên bản.');
        return;
      }

      for (const variant of variants) {
        if (!variant.color || !variant.storage || variant.price === undefined || variant.stock_quantity === undefined || !variant.status) {
          message.error('Tất cả các trường của phiên bản phải được điền đầy đủ.');
          return;
        }
      }

      const formattedVariants = variants.map(variant => ({
        ...variant,
        price: Number(variant.price),
        discount_price: variant.discount_price ? Number(variant.discount_price) : null,
        stock_quantity: Number(variant.stock_quantity),
        status: variant.status || 'in_stock'
      }));

      const productData = {
        ...values,
        image: imageUrl,
        productVariants: formattedVariants
      };

      if (editingId) {
        // Update product
        await adminService.updateProduct(editingId, productData);
        
        // Update each variant
        for (const variant of formattedVariants) {
          if (variant.id) {
            // Update existing variant
            await adminService.updateProductVariant(variant.id, variant);
          } else {
            // Add new variant
            await adminService.createProductVariant({
              ...variant,
              productId: editingId
            });
          }
        }
        
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Create new product
        const response = await adminService.createProduct(productData);
        const newProductId = response.data.id;
        
        // Create variants for the new product
        for (const variant of formattedVariants) {
          await adminService.createProductVariant({
            ...variant,
            productId: newProductId
          });
        }
        
        message.success('Thêm sản phẩm thành công');
      }
      
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
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
      title: 'Thương hiệu',
      dataIndex: 'brandId',
      key: 'brandId',
      render: (brandId) => {
        const brand = brands.find(b => b.id === brandId);
        return brand ? brand.name : 'Không xác định';
      }
    },
    {
      title: 'Số phiên bản',
      key: 'variants',
      render: (_, record) => record.productVariants?.length || 0,
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên sản phẩm"
            allowClear
            onChange={handleSearch}
            style={{ width: 220 }}
          />
          <Select
            placeholder="Lọc theo thương hiệu"
            style={{ width: 180 }}
            onChange={handleBrandFilter}
            allowClear
            value={brandFilter}
          >
            {brands.map(brand => (
              <Option key={brand.id} value={brand.id}>{brand.name}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
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
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thông tin cơ bản" key="1">
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
              >
                <Select>
                  {brands.map(brand => (
                    <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                  ))}
                </Select>
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
            </TabPane>

            <TabPane tab="Phiên bản sản phẩm" key="2">
              <Button type="primary" onClick={handleAddVariant} style={{ marginBottom: 16 }}>
                Thêm phiên bản
              </Button>

              {variants.map((variant, index) => (
                <Card key={index} style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      label="Màu sắc"
                      required
                    >
                      <Input
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Dung lượng"
                      required
                    >
                      <Input
                        value={variant.storage}
                        onChange={(e) => handleVariantChange(index, 'storage', e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Giá"
                      required
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        value={variant.price}
                        onChange={(value) => handleVariantChange(index, 'price', value)}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Giá khuyến mãi"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        value={variant.discount_price}
                        onChange={(value) => handleVariantChange(index, 'discount_price', value)}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Số lượng"
                      required
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        value={variant.stock_quantity}
                        onChange={(value) => handleVariantChange(index, 'stock_quantity', value)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Trạng thái"
                      required
                    >
                      <Select
                        value={variant.status}
                        onChange={(value) => handleVariantChange(index, 'status', value)}
                      >
                        <Option value="in_stock">Còn hàng</Option>
                        <Option value="out_of_stock">Hết hàng</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Hình ảnh"
                    >
                      <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={(file) => handleVariantImageUpload(file, index)}
                        accept="image/*"
                        disabled={uploadingVariants[index]}
                      >
                        {variant.image ? (
                          <img src={variant.image} alt="variant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : uploadingVariants[index] ? (
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

                    <Button danger onClick={() => handleRemoveVariant(index)}>
                      Xóa phiên bản
                    </Button>
                  </Space>
                </Card>
              ))}
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 16 }}>
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