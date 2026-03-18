import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api/products';
import { formatINR } from '../../lib/currency';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const total = products.length;
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = total - inStock;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const byCategory = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryRows = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Catalog overview</p>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total products</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In stock</span>
          <span className="stat-value">{inStock}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Out of stock</span>
          <span className="stat-value stat-warn">{outOfStock}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Inventory value</span>
          <span className="stat-value">{formatINR(totalValue)}</span>
        </div>
      </div>

      <div className="admin-grid-2">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="admin-panel-title">By category</h2>
            <Link to="/admin/products" className="section-link">Manage →</Link>
          </div>
          {categoryRows.length === 0 ? (
            <p className="empty">No products yet.</p>
          ) : (
            <ul className="bar-list">
              {categoryRows.map(([cat, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <li key={cat} className="bar-row">
                    <span className="bar-label">{cat}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="bar-count">{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="admin-panel-title">Recently added</h2>
            <Link to="/admin/products" className="section-link">All →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="empty">No products yet.</p>
          ) : (
            <ul className="recent-list">
              {recent.map((p) => (
                <li key={p.id} className="recent-row">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="recent-thumb" />
                  ) : (
                    <div className="recent-thumb recent-thumb-placeholder">文</div>
                  )}
                  <div className="recent-info">
                    <div className="recent-name">{p.name}</div>
                    <div className="recent-meta">{p.category} · {formatINR(p.price)}</div>
                  </div>
                  <span className={`product-stock ${p.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {p.inStock ? 'Live' : 'Out'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
