import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/products';

const CATEGORIES = ['Tees', 'Hoodies', 'Customs', 'Posters', 'Stickers', 'Bottoms', 'Accessories'];

function ShopPage() {
  const { category: categoryParam } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryParam || '');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setCategory(categoryParam || '');
  }, [categoryParam]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort === 'price-asc') { params.sort = 'price'; params.order = 'asc'; }
    if (sort === 'price-desc') { params.sort = 'price'; params.order = 'desc'; }
    if (sort === 'name') { params.sort = 'name'; params.order = 'asc'; }
    fetchProducts(params)
      .then((data) => { if (!ignore) setProducts(data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [search, category, sort]);

  return (
    <div className="shop-page">
      <header className="shop-header">
        <h1 className="page-title">
          {category || 'Catalog'}<span className="kanji">品</span>
        </h1>
        <p className="page-subtitle">
          {category ? `Everything under ${category}.` : 'All drops, all categories.'}
        </p>
      </header>

      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="category-select"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="empty">Nothing matches. Try a different filter.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default ShopPage;
