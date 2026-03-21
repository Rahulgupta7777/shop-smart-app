const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '₹0';
  return formatter.format(Math.round(amount));
}

export const FREE_SHIPPING_THRESHOLD = 1499;
export const FLAT_SHIPPING_RATE = 79;
