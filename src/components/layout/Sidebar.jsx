import { useState, useEffect } from 'react'
import { Radio, Input, Button, Space, Typography, Form, Card } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const { Title } = Typography

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [form] = Form.useForm()
  
  const searchParams = new URLSearchParams(location.search)
  const branch = searchParams.get('branch') || 'all'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  useEffect(() => {
    if (minPrice || maxPrice) {
      form.setFieldsValue({
        minPrice: minPrice || '',
        maxPrice: maxPrice || ''
      })
      
      const matchingRange = priceRanges.find(range => 
        (range.min === (minPrice ? parseInt(minPrice) : 0)) && 
        (range.max === (maxPrice ? parseInt(maxPrice) : null))
      )
      
      if (matchingRange) {
        setSelectedPriceRange(matchingRange)
      } else {
        setSelectedPriceRange(null)
      }
    } else {
      setSelectedPriceRange(priceRanges[0])
    }
  }, [minPrice, maxPrice])

  const priceRanges = [
    { id: 1, label: 'Tất cả', value: null, min: null, max: null },
    { id: 2, label: 'Dưới 2 triệu', min: 0, max: 2000000 },
    { id: 3, label: 'Từ 2 - 4 triệu', min: 2000000, max: 4000000 },
    { id: 4, label: 'Từ 4 - 7 triệu', min: 4000000, max: 7000000 },
    { id: 5, label: 'Từ 7 - 13 triệu', min: 7000000, max: 13000000 },
    { id: 6, label: 'Từ 13 - 20 triệu', min: 13000000, max: 20000000 },
    { id: 7, label: 'Trên 20 triệu', min: 20000000, max: null }
  ]

  const handlePriceRangeChange = (e) => {
    const selectedRange = priceRanges.find(range => range.id === e.target.value)
    setSelectedPriceRange(selectedRange)
    
    form.setFieldsValue({
      minPrice: selectedRange?.min || '',
      maxPrice: selectedRange?.max || ''
    })
    
    updateUrlWithPriceFilter(selectedRange?.min, selectedRange?.max)
  }

  const handleCustomPriceSubmit = (values) => {
    const { minPrice, maxPrice } = values
    updateUrlWithPriceFilter(minPrice, maxPrice)
  }
  
  const updateUrlWithPriceFilter = (minPrice, maxPrice) => {
    const newSearchParams = new URLSearchParams(location.search)
    
    if (branch && branch !== 'all') {
      newSearchParams.set('branch', branch)
    } else {
      newSearchParams.set('branch', 'all')
    }
    
    if (minPrice) {
      newSearchParams.set('minPrice', minPrice)
    } else {
      newSearchParams.delete('minPrice')
    }
    
    if (maxPrice) {
      newSearchParams.set('maxPrice', maxPrice)
    } else {
      newSearchParams.delete('maxPrice')
    }
    
    navigate(`${location.pathname}?${newSearchParams.toString()}`)
  }

  return (
    <div className="sidebar">
      <Card className="filter-section">
        <Title level={5}>MỨC GIÁ</Title>
        
        <Radio.Group 
          className="price-ranges"
          value={selectedPriceRange?.id}
          onChange={handlePriceRangeChange}
        >
          <Space direction="vertical">
            {priceRanges.map(range => (
              <Radio key={range.id} value={range.id}>
                {range.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div className="custom-price-range">
          <Typography.Text>Nhập khoảng giá phù hợp với bạn:</Typography.Text>
          <Form 
            form={form}
            onFinish={handleCustomPriceSubmit}
            layout="vertical"
            className="price-form"
          >
            <div className="price-inputs">
              <Form.Item name="minPrice" noStyle>
                <Input
                  type="number"
                  placeholder="13000000"
                  min={0}
                />
              </Form.Item>
              <span>~</span>
              <Form.Item name="maxPrice" noStyle>
                <Input
                  type="number"
                  placeholder="20000000"
                  min={0}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-apply">
                Áp dụng
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  )
}

export default Sidebar