export const COLORS = {
  // Ocean palette
  paper: '#FAF7F1',
  sand: '#F1EADA',
  sandDeep: '#E7DDC5',
  ink: '#12283A',
  ink2: '#24435E',
  ink3: '#5B7589',
  mute: '#94A7B5',
  line: '#E2DCCC',
  lineSoft: '#EFE8D6',
  teal: '#2E7D8A',
  tealSoft: '#B9D7DB',
  tealPale: '#E5F0F1',
  coral: '#E27A5C',
  coralSoft: '#F6D7CB',
  sun: '#E8B84C',
  sunSoft: '#F5E6B8',
  leaf: '#6A8E5F',
  leafSoft: '#D3DEC8',

  // Backward-compat aliases
  primary: '#2E7D8A',
  secondary: '#6A8E5F',
  error: '#E27A5C',
  text: '#12283A',
  background: '#FAF7F1',
  neutral100: '#FAF7F1',
  neutral200: '#F1EADA',
  neutral300: '#E2DCCC',
  neutral500: '#94A7B5',
  neutral900: '#12283A',
  white: '#FFFFFF',
};

export const CAT_TINT = {
  clothing: { bg: '#F3F7F4', accent: '#2E7D8A', accentSoft: '#B9D7DB', glyphBg: '#E5F0F1' },
  documents: { bg: '#FBF2EE', accent: '#E27A5C', accentSoft: '#F6D7CB', glyphBg: '#F9DED3' },
  tech: { bg: '#F1F3F6', accent: '#24435E', accentSoft: '#C7D2DD', glyphBg: '#DAE2EA' },
  extras: { bg: '#F4F7EF', accent: '#6A8E5F', accentSoft: '#D3DEC8', glyphBg: '#E2EBD6' },
} as const;

export type CategoryKey = keyof typeof CAT_TINT;
