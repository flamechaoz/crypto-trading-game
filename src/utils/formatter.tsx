export const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
