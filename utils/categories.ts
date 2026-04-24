import { CAT_TINT, COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';

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

export function groupByCategory(items: PackingItem[]): Record<string, PackingItem[]> {
  const map: Record<string, PackingItem[]> = {};
  for (const item of items) {
    const cat = item.category || 'extras';
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  }
  return map;
}

export function orderCategories(grouped: Record<string, PackingItem[]>): string[] {
  const present = new Set(Object.keys(grouped));
  const ordered: string[] = (SUGGESTED_CATEGORIES as readonly string[]).filter((c) =>
    present.has(c),
  );
  for (const c of present) {
    if (!(SUGGESTED_CATEGORIES as readonly string[]).includes(c)) ordered.push(c);
  }
  return ordered;
}
