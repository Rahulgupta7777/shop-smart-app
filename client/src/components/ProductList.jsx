import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      const data = await fetchProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter]);

  const handleCreate = async (data) => {
    try {
      await createProduct(data);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="product-list-container">
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
        >
          + Add Product
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="empty">No products found. Add your first product!</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
