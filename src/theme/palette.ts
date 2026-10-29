// Core tokens: raw values sampled from the Figma design (see docs/DESIGN_SYSTEM.md).
// Only theme files may import this — components use the semantic tokens in ./colors.
export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  ink950: '#0B0B14',
  navy900: '#18172B',
  navy850: '#1A192F',
  slate800: '#212E43',
  teal900: '#112A2B',
  cyan400: '#64EDF7',
  violet400: '#B87DF7',
  violet500: '#C46FF8',
  white65: 'rgba(255,255,255,0.65)',
  white40: 'rgba(255,255,255,0.40)',
  white10: 'rgba(255,255,255,0.10)',
  black0: 'rgba(0,0,0,0)',
  black60: 'rgba(0,0,0,0.60)',
  black85: 'rgba(0,0,0,0.85)',
  transparent: 'transparent',
} as const;
