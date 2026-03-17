import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProduct } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { formatINR } from '../lib/currency';

const APPAREL_CATEGORIES = ['Tees', 'Hoodies', 'Bottoms'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchProduct(id)
      .then((data) => { if (!ignore) setProduct(data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id]);

  const needsSize = product && APPAREL_CATEGORIES.includes(product.category);

  const handleAdd = () => {
    if (!product.inStock) return;
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      size: needsSize ? size : null,
      qty,
    });
    toast.success(`Added ${qty} × ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate('/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return null;

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-gallery">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="detail-gallery-placeholder">文字</div>
          )}
        </div>

        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">{formatINR(product.price)}</div>

          {product.description && (
            <p className="detail-description">{product.description}</p>
          )}

          <div className={`detail-stock-row ${product.inStock ? '' : 'detail-stock-out'}`}>
            {product.inStock ? (
              <span className="in-stock product-stock">In stock · {product.quantity} available</span>
            ) : (
              <span className="out-of-stock product-stock">Out of stock — notify me?</span>
            )}
          </div>

          {needsSize && (
            <div className="size-selector">
              <label className="detail-label">Size</label>
              <div className="size-pills">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qty-selector">
            <label className="detail-label">Quantity</label>
            <div className="qty-controls">
              <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="qty-value">{qty}</span>
              <button type="button" className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="detail-ctas">
            <button
              type="button"
              className="btn btn-neu"
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy now
            </button>
          </div>

          <div className="detail-meta-list">
            <div>Small batch · printed in India</div>
            <div>Free shipping over {formatINR(1499)} · 7-day easy returns</div>
            <div>Made to order — ships in 5–7 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
