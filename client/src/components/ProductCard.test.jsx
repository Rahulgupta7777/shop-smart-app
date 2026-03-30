import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  price: 29.99,
  category: 'Electronics',
  inStock: true,
  quantity: 10,
  imageUrl: 'https://via.placeholder.com/300',
};

describe('ProductCard', () => {
  it('renders product details', () => {
    render(<ProductCard product={mockProduct} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('In Stock (10)')).toBeInTheDocument();
  });

  it('shows out of stock badge', () => {
    const outOfStock = { ...mockProduct, inStock: false, quantity: 0 };
    render(<ProductCard product={outOfStock} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<ProductCard product={mockProduct} onEdit={onEdit} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<ProductCard product={mockProduct} onEdit={() => {}} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} onEdit={() => {}} onDelete={() => {}} />);
    const img = screen.getByAltText('Test Product');
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://via.placeholder.com/300');
  });
});
