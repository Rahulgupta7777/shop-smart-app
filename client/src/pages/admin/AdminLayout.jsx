import { NavLink, Outlet, Link } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-label">Admin</span>
          <span className="admin-brand-kanji">管</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">▦</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">📦</span>
            Products
          </NavLink>
          <NavLink to="/admin/images" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">✦</span>
            Image Studio
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-back-link">← Back to shop</Link>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
