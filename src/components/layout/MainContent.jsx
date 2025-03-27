import './MainContent.css'
import Banner from './Banner'
import ProductSection from '../product/ProductSection/ProductSection'

const MainContent = () => {
  // Dữ liệu tĩnh cho điện thoại
  const phones = [
    {
      id: 1,
      name: 'Điện Thoại Nokia 3 - Hàng Chính Hãng',
      price: 2790000,
      originalPrice: 3290000,
      image: 'https://via.placeholder.com/200x200',
      discount: 15
    },
    {
      id: 2,
      name: 'Điện Thoại Blackberry KEYone - Hàng Chính Hãng',
      price: 14990000,
      originalPrice: 16990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 12
    },
    {
      id: 3,
      name: 'Điện Thoại Motorola Moto G5S - Hàng Chính Hãng',
      price: 4290000,
      originalPrice: 5290000,
      image: 'https://via.placeholder.com/200x200',
      discount: 19
    },
    {
      id: 4,
      name: 'Điện Thoại Motorola Moto Z2 Play - Hàng Chính Hãng',
      price: 9450000,
      originalPrice: 10450000,
      image: 'https://via.placeholder.com/200x200',
      discount: 13
    },
    {
      id: 5,
      name: 'Điện Thoại Samsung Galaxy J7 Pro - Hàng Chính Hãng',
      price: 6990000,
      originalPrice: 7990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 14
    }
  ]

  // Dữ liệu tĩnh cho laptop
  const laptops = [
    {
      id: 1,
      name: 'Laptop HP ProBook Air G3 T9E02PA',
      price: 15950000,
      originalPrice: 16950000,
      image: 'https://via.placeholder.com/200x200',
      discount: 6
    },
    {
      id: 2,
      name: 'Laptop HP Folio 13 with RTX 2070Ti',
      price: 24290000,
      originalPrice: 25990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 6
    },
    {
      id: 3,
      name: 'Laptop Lenovo ThinkPad T470',
      price: 21900000,
      originalPrice: 22900000,
      image: 'https://via.placeholder.com/200x200',
      discount: 4
    },
    {
      id: 4,
      name: 'Laptop Lenovo IdeaPad Y520',
      price: 19990000,
      originalPrice: 21990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 9
    }
  ]

  // Dữ liệu tĩnh cho máy tính bảng
  const tablets = [
    {
      id: 1,
      name: 'Máy Tính Bảng CyanoPad M7089',
      price: 1499000,
      originalPrice: 1999000,
      image: 'https://via.placeholder.com/200x200',
      discount: 25
    },
    {
      id: 2,
      name: 'Máy Tính Bảng Bemove M112ZX',
      price: 4499000,
      originalPrice: 5499000,
      image: 'https://via.placeholder.com/200x200',
      discount: 18
    },
    {
      id: 3,
      name: 'Máy Tính Bảng Samsung Galaxy Tab 2',
      price: 5499000,
      originalPrice: 5999000,
      image: 'https://via.placeholder.com/200x200',
      discount: 22
    },
    {
      id: 4,
      name: 'Máy Tính Bảng Huawei T3 10',
      price: 3199000,
      originalPrice: 3999000,
      image: 'https://via.placeholder.com/200x200',
      discount: 21
    },
    {
      id: 5,
      name: 'Máy Tính Bảng Kindle Tab S2',
      price: 2199000,
      originalPrice: 2499000,
      image: 'https://via.placeholder.com/200x200',
      discount: 12
    }
  ]

  // Dữ liệu tĩnh cho gia dụng
  const appliances = [
    {
      id: 1,
      name: 'Máy Lọc Nước RO 2.0 Kanful',
      price: 8399000,
      originalPrice: 8999000,
      image: 'https://via.placeholder.com/200x200',
      discount: 15
    },
    {
      id: 2,
      name: 'Máy Lọc Nước Pentel - XL',
      price: 2999000,
      originalPrice: 3199000,
      image: 'https://via.placeholder.com/200x200',
      discount: 12
    },
    {
      id: 3,
      name: 'Máy Hút Bụi Hitachi CV-BF18',
      price: 1999000,
      originalPrice: 2199000,
      image: 'https://via.placeholder.com/200x200',
      discount: 31
    },
    {
      id: 4,
      name: 'Máy Hút Bụi Electrolux Z1231',
      price: 3399000,
      originalPrice: 3599000,
      image: 'https://via.placeholder.com/200x200',
      discount: 43
    },
    {
      id: 5,
      name: 'Máy Vắt Cam DAEWOO OPU-5',
      price: 259000,
      originalPrice: 299000,
      image: 'https://via.placeholder.com/200x200',
      discount: 42
    }
  ]

  return (
    <div className="main-content">
      <Banner />
      <ProductSection title="ĐIỆN THOẠI" products={phones} categories={['Apple', 'Blackberry', 'Motorola', 'Nokia', 'Samsung']} />
      <ProductSection title="LAPTOP" products={laptops} categories={['Macbook', 'Asus', 'Dell', 'HP', 'Lenovo']} />
      <ProductSection title="MÁY TÍNH BẢNG" products={tablets} categories={['Ipad', 'Samsung', 'Kindle', 'Mobiil', 'Huawei', 'Bemove', 'CyanoPad', 'Noi']} />
      <ProductSection title="GIA DỤNG" products={appliances} categories={['Lọc nước', 'Máy hút bụi', 'Máy lọc nước', 'Máy xay', 'Nồi cơm điện']} />
    </div>
  )
}

export default MainContent