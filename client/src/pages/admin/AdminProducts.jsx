import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProductCardAdmin from '../../components/admin/ProductCardAdmin';
import ProductForm from '../../components/admin/ProductForm';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';

const CATEGORIES = ['Tees', 'Hoodies', 'Customs', 'Posters', 'Stickers', 'Bottoms', 'Accessories'];

function AdminProducts() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter]);

  const handleCreate = async (data) => {
    try {
      await createProduct(data);
      setShowForm(false);
      toast.success('Product added');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setShowForm(false);
      toast.success('Product updated');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
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

  return (
    <div className="admin-products">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} in catalog</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
        >
          + Add Product
        </button>
      </header>

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
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
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
        <p className="empty">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCardAdmin
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

export default AdminProducts;
