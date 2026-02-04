import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'moji-cart-v1';

const keyFor = (item) => `${item.productId}::${item.size || '-'}`;

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const incoming = action.item;
      const k = keyFor(incoming);
      const existing = state.find((i) => keyFor(i) === k);
      if (existing) {
        return state.map((i) =>
          keyFor(i) === k ? { ...i, qty: i.qty + incoming.qty } : i
        );
      }
      return [...state, incoming];
    }
    case 'remove':
      return state.filter((i) => keyFor(i) !== action.key);
    case 'setQty':
      return state
        .map((i) => (keyFor(i) === action.key ? { ...i, qty: Math.max(1, action.qty) } : i))
        .filter((i) => i.qty > 0);
    case 'clear':
      return [];
    case 'hydrate':
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', items: JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const value = {
    items,
    count,
    subtotal,
    add: (item) => dispatch({ type: 'add', item }),
    remove: (key) => dispatch({ type: 'remove', key }),
    setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
    clear: () => dispatch({ type: 'clear' }),
    keyFor,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
