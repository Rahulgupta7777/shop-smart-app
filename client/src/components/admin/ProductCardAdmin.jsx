function ProductCardAdmin({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      ) : (
        <div className="product-image-placeholder">文字</div>
      )}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-description">{product.description}</p>}
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
          </span>
        </div>
        <div className="product-actions">
          <button className="btn btn-edit" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button className="btn btn-delete" onClick={() => onDelete(product.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCardAdmin;
