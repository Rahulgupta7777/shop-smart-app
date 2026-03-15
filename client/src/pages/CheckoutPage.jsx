import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { formatINR, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from '../lib/currency';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if (items.length === 0 && !orderId) {
    return (
      <div className="cart-empty">
        <h1 className="page-title">Cart is empty</h1>
        <p className="page-subtitle">Nothing to checkout.</p>
        <Link to="/shop" className="btn btn-primary">Shop the catalog</Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['name', 'email', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error(`${field[0].toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }
    setSubmitting(true);
    setTimeout(() => {
      const id = `MOJI-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(id);
      clear();
      toast.success('Order placed!');
      setSubmitting(false);
    }, 600);
  };

  if (orderId) {
    return (
      <div className="order-success">
        <div className="success-kanji">感</div>
        <h1 className="page-title">Thank you!</h1>
        <p className="page-subtitle">Your order has been placed.</p>
        <div className="order-id">Order ID: <strong>{orderId}</strong></div>
        <p className="order-note">
          This is a demo checkout — no payment was charged and no order was actually shipped. In production, Razorpay would handle payment and Printrove would handle fulfillment.
        </p>
        <div className="detail-ctas" style={{ justifyContent: 'center' }}>
          <button className="btn btn-neu" onClick={() => navigate('/')}>Back home</button>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Keep shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="shop-header">
        <h1 className="page-title">Checkout<span className="kanji">払</span></h1>
        <p className="page-subtitle">Complete your order — demo mode, no real payment</p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2 className="summary-title">Shipping details</h2>

          <div className="form-group">
            <label htmlFor="name">Full name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Street address *</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pincode">PIN code *</label>
            <input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary summary-cta" disabled={submitting}>
            {submitting ? 'Placing order...' : `Place order · ${formatINR(total)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h2 className="summary-title">Your order</h2>
          <ul className="checkout-items">
            {items.map((item, idx) => (
              <li key={idx} className="checkout-item">
                <span className="checkout-item-name">
                  {item.name}
                  {item.size && <span className="cart-item-size"> · {item.size}</span>}
                  <span className="checkout-item-qty"> × {item.qty}</span>
                </span>
                <span>{formatINR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
