import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  price: 29.99,
  category: 'Tees',
  inStock: true,
  quantity: 10,
  imageUrl: 'https://via.placeholder.com/300',
};

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProductCard', () => {
  it('renders product details', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Tees')).toBeInTheDocument();
    expect(screen.getByText('In Stock (10)')).toBeInTheDocument();
  });

  it('shows out of stock badge', () => {
    const outOfStock = { ...mockProduct, inStock: false, quantity: 0 };
    renderWithRouter(<ProductCard product={outOfStock} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('renders product image', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText('Test Product');
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://via.placeholder.com/300');
  });

  it('links to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/product/1');
  });
});
