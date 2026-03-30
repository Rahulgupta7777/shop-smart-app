import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

describe('App', () => {
  it('renders ShopSmart title in navbar', () => {
    render(<App />);
    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
  });

  it('renders the Add Product button', () => {
    render(<App />);
    expect(screen.getByText('+ Add Product')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });
});
