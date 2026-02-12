const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'moji-auth-token';

function authHeaders() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.order) query.set('order', params.order);

  const res = await fetch(`${API_URL}/api/products?${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}
