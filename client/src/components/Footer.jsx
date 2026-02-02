import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo">Moji</span>
          <span className="navbar-kanji">文字</span>
          <p className="footer-tagline">Anime-aesthetic apparel. Small batch. Made in India.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All products</Link>
            <Link to="/shop/Tees">Tees</Link>
            <Link to="/shop/Hoodies">Hoodies</Link>
            <Link to="/shop/Customs">Customs</Link>
            <Link to="/shop/Posters">Posters</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a href="#shipping">Shipping</a>
            <a href="#returns">Returns</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="#story">Our story</a>
            <a href="#instagram">Instagram</a>
            <a href="#press">Press</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Moji · 文字</span>
        <span>All original designs · No licensed IP</span>
      </div>
    </footer>
  );
}

export default Footer;
