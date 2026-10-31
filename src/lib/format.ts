import type { Money } from '@/domain';

export function formatPrice({ amountMinor, currency }: Money, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountMinor / 100);
}

const COMPACT_UNITS = [
  { value: 1_000_000, suffix: 'M' },
  { value: 1_000, suffix: 'K' },
] as const;

/** 12000 → "12K", 1500 → "1.5K", 342 → "342". */
export function formatCompactNumber(value: number): string {
  for (const unit of COMPACT_UNITS) {
    if (Math.abs(value) >= unit.value) {
      const scaled = Math.round((value / unit.value) * 10) / 10;
      return `${scaled}${unit.suffix}`;
    }
  }
  return String(value);
}

/** 105 → "1:45". */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Short decimal for UI meta ("1.5" / "1,5"), at most one fraction digit. */
export function formatDecimal(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}
