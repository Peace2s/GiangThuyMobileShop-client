import './MainContent.css'
import Banner from './Banner'
import ProductSection from '../product/ProductSection/ProductSection'

const MainContent = () => {
  // Dữ liệu tĩnh cho điện thoại
  const phones = [
    {
      id: 1,
      name: 'Điện Thoại Nokia 3 - Hàng Chính Hãng',
      price: 3290000,
      image: 'https://via.placeholder.com/200x200',
      discount: 15
    },
    {
      id: 2,
      name: 'Điện Thoại Blackberry KEYone - Hàng Chính Hãng',
      price: 16990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 12
    },
    {
      id: 3,
      name: 'Điện Thoại Motorola Moto G5S - Hàng Chính Hãng',
      price: 5290000,
      image: 'https://via.placeholder.com/200x200',
      discount: 19
    },
    {
      id: 4,
      name: 'Điện Thoại Motorola Moto Z2 Play - Hàng Chính Hãng',
      price: 10450000,
      image: 'https://via.placeholder.com/200x200',
      discount: 13
    },
    {
      id: 5,
      name: 'Điện Thoại Samsung Galaxy J7 Pro - Hàng Chính Hãng',
      price: 7990000,
      image: 'https://via.placeholder.com/200x200',
      discount: 14
    }
  ]

  // Dữ liệu tĩnh cho phụ kiện điện thoại
  const accessories = [
    {
      id: 1,
      name: 'Ốp Lưng iPhone 12',
      price: 200000,
      image: 'https://via.placeholder.com/200x200',
      discount: 25
    },
    // Add more accessories as needed
  ]

  return (
    <div className="main-content">
      <Banner />
      <ProductSection title="ĐIỆN THOẠI" products={phones} categories={['Apple', 'Samsung', 'Nokia', 'Motorola']} />
      <ProductSection title="PHỤ KIỆN ĐIỆN THOẠI" products={accessories} categories={['Ốp lưng', 'Sạc dự phòng', 'Tai nghe']} />
    </div>
  )
}

export default MainContent