import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/products';

const FEATURED_CATEGORIES = [
  { slug: 'Tees', label: 'Tees', kanji: '丁' },
  { slug: 'Hoodies', label: 'Hoodies', kanji: '上' },
  { slug: 'Posters', label: 'Posters', kanji: '画' },
  { slug: 'Customs', label: 'Customs', kanji: '字' },
  { slug: 'Accessories', label: 'Accessories', kanji: '小' },
  { slug: 'Stickers', label: 'Stickers', kanji: '貼' },
];

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setFeatured(data.filter((p) => p.inStock).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">Small batch · anime aesthetic</span>
          <h1 className="hero-title">
            Wear your <span className="hero-accent">story</span>.
          </h1>
          <p className="hero-subtitle">
            Custom-lettering apparel inspired by anime, cyberpunk, and quiet watercolor moments.
            Every drop is limited.
          </p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn btn-primary">Shop the catalog →</Link>
            <Link to="/shop/Customs" className="btn btn-neu">Customize yours</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-kanji">文字</div>
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2 className="section-title">Shop by category</h2>
          <Link to="/shop" className="section-link">View all →</Link>
        </div>
        <div className="category-grid">
          {FEATURED_CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="category-tile">
              <span className="category-tile-kanji">{c.kanji}</span>
              <span className="category-tile-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2 className="section-title">Fresh drops</h2>
          <Link to="/shop" className="section-link">View all →</Link>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="home-cta">
        <h2 className="section-title">Made to order, always original.</h2>
        <p>No licensed IP. No fast fashion. Just original anime-aesthetic art printed small batch in India.</p>
        <Link to="/shop" className="btn btn-primary">Start shopping</Link>
      </section>
    </div>
  );
}

export default HomePage;
