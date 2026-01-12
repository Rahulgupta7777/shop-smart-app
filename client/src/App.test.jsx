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
  localStorage.clear();
});

describe('App', () => {
  it('renders Moji brand in navbar', () => {
    render(<App />);
    expect(screen.getAllByText('Moji').length).toBeGreaterThan(0);
  });

  it('renders hero title on home page', () => {
    render(<App />);
    expect(screen.getByText(/Wear your/i)).toBeInTheDocument();
  });

  it('renders the Shop nav link', () => {
    render(<App />);
    expect(screen.getAllByText('Shop').length).toBeGreaterThan(0);
  });

  it('renders cart link', () => {
    render(<App />);
    expect(screen.getByLabelText('Cart')).toBeInTheDocument();
  });
});
