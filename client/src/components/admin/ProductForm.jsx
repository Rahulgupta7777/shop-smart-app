import { useState, useEffect } from 'react';
import ImageGenerator from './ImageGenerator';
import ImageUpload from './ImageUpload';

const CATEGORIES = ['Tees', 'Hoodies', 'Customs', 'Posters', 'Stickers', 'Bottoms', 'Accessories'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  inStock: true,
  quantity: '',
  imageUrl: '',
};

const TABS = [
  { id: 'generate', label: 'Generate with AI' },
  { id: 'upload', label: 'Upload' },
  { id: 'url', label: 'Paste URL' },
];

function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [imageTab, setImageTab] = useState('generate');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        category: product.category,
        inStock: product.inStock,
        quantity: String(product.quantity),
        imageUrl: product.imageUrl || '',
      });
      if (product.imageUrl) setImageTab('url');
    } else {
      setForm(emptyForm);
      setImageTab('generate');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setImageUrl = (url) => setForm((prev) => ({ ...prev, imageUrl: url }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.category || !form.price) {
      setError('Name, price, and category are required');
      return;
    }

    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      setError('Price must be a valid non-negative number');
      return;
    }

    const quantity = parseInt(form.quantity) || 0;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price,
      category: form.category,
      inStock: form.inStock,
      quantity,
      imageUrl: form.imageUrl.trim() || null,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Product description" rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="0.00" />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="0" />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
              In Stock
            </label>
          </div>
        </div>

        <div className="image-section">
          <div className="image-section-head">
            <div className="image-section-label">Product Image</div>
            {form.imageUrl ? (
              <span className="image-attached">
                ✓ Attached
                <button
                  type="button"
                  className="image-clear"
                  onClick={() => setImageUrl('')}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </span>
            ) : (
              <span className="image-attached image-attached-empty">No image yet</span>
            )}
          </div>
          <div className="image-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`image-tab ${imageTab === t.id ? 'active' : ''}`}
                onClick={() => setImageTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {imageTab === 'generate' && <ImageGenerator onGenerated={setImageUrl} />}
          {imageTab === 'upload' && <ImageUpload onUploaded={setImageUrl} />}
          {imageTab === 'url' && (
            <input
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="search-input"
              style={{ width: '100%', maxWidth: 'none' }}
            />
          )}

          {form.imageUrl && imageTab !== 'url' && (
            <div className="image-preview" style={{ marginTop: '0.85rem' }}>
              <img src={form.imageUrl} alt="Selected" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {product ? 'Update' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
