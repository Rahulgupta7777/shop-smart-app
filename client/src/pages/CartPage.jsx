import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatINR, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from '../lib/currency';

function CartPage() {
  const { items, count, subtotal, setQty, remove, keyFor, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-kanji">空</div>
        <h1 className="page-title">Your cart is empty</h1>
        <p className="page-subtitle">Start browsing — every drop is limited.</p>
        <Link to="/shop" className="btn btn-primary">Shop the catalog</Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <header className="shop-header">
        <h1 className="page-title">Your cart<span className="kanji">籠</span></h1>
        <p className="page-subtitle">{count} {count === 1 ? 'item' : 'items'}</p>
      </header>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => {
            const k = keyFor(item);
            return (
              <li key={k} className="cart-item">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                ) : (
                  <div className="cart-item-img cart-item-placeholder">文字</div>
                )}
                <div className="cart-item-info">
                  <span className="product-category">{item.category}</span>
                  <h3 className="cart-item-name">{item.name}</h3>
                  {item.size && <span className="cart-item-size">Size {item.size}</span>}
                  <div className="cart-item-price">{formatINR(item.price)}</div>
                </div>
                <div className="cart-item-right">
                  <div className="qty-controls qty-controls-sm">
                    <button className="qty-btn" onClick={() => setQty(k, item.qty - 1)}>−</button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => setQty(k, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-remove" onClick={() => remove(k)}>Remove</button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="cart-summary">
          <h2 className="summary-title">Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
          </div>
          {shipping > 0 && (
            <div className="summary-hint">
              Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </div>
          )}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary summary-cta">Checkout →</Link>
          <button className="btn btn-ghost summary-clear" onClick={clear}>Clear cart</button>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
