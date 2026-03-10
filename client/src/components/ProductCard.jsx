import { Link } from 'react-router-dom';
import { formatINR } from '../lib/currency';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <article className="product-card">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">文字</div>
        )}
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-meta">
            <span className="product-price">{formatINR(product.price)}</span>
            <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
