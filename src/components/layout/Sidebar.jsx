import './Sidebar.css'

const Sidebar = () => {
  const categories = [
    { id: 1, name: 'Điện thoại', icon: 'fa-mobile-alt' },
    { id: 2, name: 'Laptop', icon: 'fa-laptop' },
    { id: 3, name: 'Tablet', icon: 'fa-tablet-alt' },
    { id: 4, name: 'Phụ kiện', icon: 'fa-headphones' },
    { id: 5, name: 'Điện gia dụng', icon: 'fa-blender' },
    { id: 6, name: 'Thủ âm thanh', icon: 'fa-volume-up' },
    { id: 7, name: 'Tủ lạnh', icon: 'fa-snowflake' },
    { id: 8, name: 'Máy hút', icon: 'fa-fan' },
    { id: 9, name: 'Thiết bị vệ phòng tắm', icon: 'fa-bath' },
    { id: 10, name: 'Máy tính để bàn/ mini', icon: 'fa-desktop' }
  ]

  const brands = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Samsung' },
    { id: 3, name: 'Xiaomi' },
    { id: 4, name: 'Nokia' },
    { id: 5, name: 'Motorola' },
    { id: 6, name: 'Blackberry' }
  ]

  return (
    <div className="sidebar">
      <div className="categories">
        <ul className="category-list">
          {categories.map(category => (
            <li key={category.id}>
              <a href="#">
                <i className={`fas ${category.icon}`}></i>
                <span>{category.name}</span>
              </a>
              <i className="fas fa-chevron-right"></i>
            </li>
          ))}
        </ul>
      </div>

      <div className="brands">
        <h3>ĐIỆN THOẠI</h3>
        <div className="brand-list">
          {brands.map(brand => (
            <a key={brand.id} href="#" className="brand-item">
              {brand.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar