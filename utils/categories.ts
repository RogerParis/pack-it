import { CAT_TINT, COLORS } from '@/theme/colors';

export const SUGGESTED_CATEGORIES = ['clothing', 'documents', 'tech', 'extras'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  clothing: 'Clothing',
  documents: 'Documents',
  tech: 'Tech',
  extras: 'Extras',
};

export function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function categoryAccent(cat: string): string {
  return (CAT_TINT as Record<string, { accent: string }>)[cat]?.accent ?? COLORS.teal;
}

export function categoryGlyphBg(cat: string): string {
  return (CAT_TINT as Record<string, { glyphBg: string }>)[cat]?.glyphBg ?? COLORS.tealPale;
}
