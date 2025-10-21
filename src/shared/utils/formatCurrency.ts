export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(value))) + ' ₽';
}

export function formatPrice(num: number): string {
  return formatRub(num);
}

export function formatPriceWithSpaces(num: number): string {
  return formatRub(num);
}
