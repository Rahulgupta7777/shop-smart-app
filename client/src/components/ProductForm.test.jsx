import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductForm from './ProductForm';

describe('ProductForm', () => {
  it('renders add form when no product prop', () => {
    render(<ProductForm product={null} onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByText('Add Product')).toBeInTheDocument();
  });

  it('renders edit form when product prop is provided', () => {
    const product = {
      name: 'Existing',
      description: 'Desc',
      price: 10,
      category: 'Electronics',
      inStock: true,
      quantity: 5,
      imageUrl: '',
    };
    render(<ProductForm product={product} onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing')).toBeInTheDocument();
  });

  it('shows error if required fields are missing', () => {
    render(<ProductForm product={null} onSubmit={() => {}} onCancel={() => {}} />);
    fireEvent.click(screen.getByText('Add Product'));
    expect(screen.getByText('Name, price, and category are required')).toBeInTheDocument();
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(<ProductForm product={null} onSubmit={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', () => {
    const onSubmit = vi.fn();
    render(<ProductForm product={null} onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'New Item' } });
    fireEvent.change(screen.getByLabelText('Price *'), { target: { value: '15.99' } });
    fireEvent.change(screen.getByLabelText('Category *'), { target: { value: 'Electronics' } });

    fireEvent.click(screen.getByText('Add Product'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Item',
        price: 15.99,
        category: 'Electronics',
      })
    );
  });
});
