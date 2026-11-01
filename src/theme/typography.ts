import type { TextStyle } from 'react-native';

// Keys match the names registered with expo-font in src/app/_layout.tsx.
export const fontFamilies = {
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sansRegular: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const typography = {
  display: { fontFamily: fontFamilies.serifBold, fontSize: 32, lineHeight: 38 },
  h1: { fontFamily: fontFamilies.serifBold, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: fontFamilies.serifBold, fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: fontFamilies.serifSemiBold, fontSize: 16, lineHeight: 22 },
  /** Small serif line above a heading ("EPISODE 12"). */
  overline: {
    fontFamily: fontFamilies.serifSemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  body: { fontFamily: fontFamilies.sansRegular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamilies.sansSemiBold, fontSize: 15, lineHeight: 22 },
  /** Large sans label (Buy button). */
  buttonLarge: { fontFamily: fontFamilies.sansSemiBold, fontSize: 18, lineHeight: 24 },
  bodySmall: { fontFamily: fontFamilies.sansRegular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamilies.sansMedium, fontSize: 11, lineHeight: 14 },
  label: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badge: {
    fontFamily: fontFamilies.sansSemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
