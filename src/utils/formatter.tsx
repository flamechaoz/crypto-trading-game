export const numberFormatter = (num: number, decimal: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimal,
  });

  return formatter.format(num);
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
