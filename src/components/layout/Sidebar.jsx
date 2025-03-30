import './Sidebar.css'

const Sidebar = () => {
  const categories = [
    { id: 1, name: 'Điện thoại', icon: 'fa-mobile-alt' },
    { id: 2, name: 'Phụ kiện', icon: 'fa-headphones' }
  ]

  const brands = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Samsung' },
    { id: 3, name: 'Nokia' },
    { id: 4, name: 'Motorola' }
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
        <h3>THƯƠNG HIỆU</h3>
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