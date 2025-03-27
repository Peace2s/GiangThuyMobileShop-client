import './ProductSection.css'
import ProductCard from '../ProductCard/ProductCard'

const ProductSection = ({ title, products, categories }) => {
  return (
    <div className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
        <div className="category-tabs">
          {categories.map((category, index) => (
            <a href="#" key={index} className={index === 0 ? 'active' : ''}>
              {category}
            </a>
          ))}
        </div>
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductSection