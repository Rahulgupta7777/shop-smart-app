import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { count } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOut = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const initials = (user?.name || user?.email || '?').slice(0, 2).toUpperCase();

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
          {isAuthenticated ? (
            <div className="user-menu" ref={menuRef}>
              <button
                type="button"
                className="user-chip"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="User menu"
              >
                <span className="user-avatar">{initials}</span>
                <span className="user-label">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-info">
                    <div className="user-dropdown-name">{user?.name || 'Account'}</div>
                    <div className="user-dropdown-email">{user?.email}</div>
                    {isAdmin && <span className="admin-badge">ADMIN</span>}
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                      Admin panel
                    </Link>
                  )}
                  <Link to="/cart" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                    Cart
                  </Link>
                  <button type="button" className="user-dropdown-item user-logout" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-neu nav-login-btn">
              Log in / Sign up
            </Link>
          )}
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
