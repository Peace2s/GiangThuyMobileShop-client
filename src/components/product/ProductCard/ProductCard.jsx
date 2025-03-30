import './ProductCard.css'

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
  }

  return (
    <div className="product-card">
      {product.discount && (
        <div className="sale-tag">-{product.discount}%</div>
      )}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <a href="#">{product.name}</a>
        </h3>
        <div className="product-price">
          <span className="price">{formatPrice(product.price - product.discount * product.price / 100)}</span>
          {product.price && (
            <span className="original-price">{formatPrice(product.price)}</span>
          )}
        </div>
        <button className="btn btn-add-cart">Thêm vào giỏ</button>
      </div>
    </div>
  )
}

export default ProductCard