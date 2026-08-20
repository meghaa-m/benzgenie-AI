/**
 * Helper utilities for BizGenie AI
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Format any numerical currency value into Indian Rupee standard format (₹)
 * e.g., 125000 -> "₹1,25,000"
 */
export function formatINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numeric);
}

/**
 * Format number into Indian comma separation without symbol
 * e.g., 125000 -> "1,25,000"
 */
export function formatNumberINR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '0';
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '0';

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(numeric);
}
