import { useState, useEffect } from 'react';

const CATEGORIES = ['Electronics', 'Groceries', 'Sports', 'Home', 'Clothing', 'Books', 'Other'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  inStock: true,
  quantity: '',
  imageUrl: '',
};

function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

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
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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

  return (
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

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? 'Update' : 'Add Product'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
