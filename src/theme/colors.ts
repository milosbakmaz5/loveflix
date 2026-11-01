import { palette } from './palette';

// Semantic tokens: what a color is for, not what it looks like. Components only use these.

export const textColors = {
  primary: palette.white,
  secondary: palette.white65,
  muted: palette.white40,
  brand: palette.cyan400,
  accent: palette.violet400,
  onBrand: palette.ink950,
} as const;

export const backgroundColors = {
  screen: palette.black,
  surface: palette.navy900,
  surfaceRaised: palette.navy850,
  surfaceSelected: palette.slate800,
  surfaceSelectedBrand: palette.teal900,
  /** Low-contrast fill for small tags ("Ep 5", counts) on images and surfaces. */
  subtle: palette.white10,
  brand: palette.cyan400,
  accent: palette.violet400,
  /** Soft violet fill (Spotlight badge). */
  accentSubtle: palette.violet25,
  overlay: palette.black60,
  /** Even dimming over artwork that carries text (hero). */
  imageDim: palette.black35,
  /** Light block on dark ("Popular Micro Dramas" heading square). */
  inverse: palette.white,
  transparent: palette.transparent,
} as const;

export const borderColors = {
  default: palette.white10,
  selected: palette.cyan400,
} as const;

export const iconColors = {
  primary: palette.white,
  secondary: palette.white65,
  muted: palette.white40,
  brand: palette.cyan400,
  accent: palette.violet400,
  onBrand: palette.ink950,
} as const;

export const shadowColors = {
  brandGlow: palette.cyan400,
} as const;

export const gradients = {
  premium: [palette.cyan400, palette.violet500],
  scrim: [palette.black0, palette.black85],
} as const;

export type TextColor = keyof typeof textColors;
export type BackgroundColor = keyof typeof backgroundColors;
export type BorderColor = keyof typeof borderColors;
export type IconColor = keyof typeof iconColors;
export type GradientName = keyof typeof gradients;
