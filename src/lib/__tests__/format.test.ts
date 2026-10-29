import { formatCompactNumber, formatDuration, formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('formats minor units as currency for the locale', () => {
    expect(formatPrice({ amountMinor: 699, currency: 'EUR' }, 'en-IE')).toBe('€6.99');
    expect(formatPrice({ amountMinor: 999, currency: 'USD' }, 'en-US')).toBe('$9.99');
  });
});

describe('formatCompactNumber', () => {
  it.each([
    [342, '342'],
    [1_000, '1K'],
    [1_500, '1.5K'],
    [12_000, '12K'],
    [2_400_000, '2.4M'],
  ])('%d → %s', (input, expected) => {
    expect(formatCompactNumber(input)).toBe(expected);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0:00'],
    [105, '1:45'],
    [192, '3:12'],
    [-5, '0:00'],
  ])('%d s → %s', (input, expected) => {
    expect(formatDuration(input)).toBe(expected);
  });
});
