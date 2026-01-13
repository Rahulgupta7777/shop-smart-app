import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { count } = useCart();

  return (
    <>
      <div className="top-banner">
        Free shipping on orders over $18 · Ships from India in 5-7 days
      </div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">Moji</span>
          <span className="navbar-kanji">文字</span>
        </Link>
        <div className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Shop
          </NavLink>
          <NavLink to="/shop/Tees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Tees
          </NavLink>
          <NavLink to="/shop/Hoodies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Hoodies
          </NavLink>
          <NavLink to="/shop/Customs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Customs
          </NavLink>
        </div>
        <div className="navbar-actions">
          <Link to="/cart" className="cart-button" aria-label="Cart">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
