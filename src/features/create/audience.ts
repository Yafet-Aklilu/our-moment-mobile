import { colors } from '@/theme';

/** Audience tags — mirrors web `resources/js/utils/audience.js` labels. */
export const AUDIENCE_LABEL: Record<string, string> = {
  partner: 'Romantic',
  family: 'Family',
  friend: 'Friendship',
  appreciation: 'Appreciation',
  everyone: 'Anyone',
};

export const AUDIENCE_FALLBACK_COLORS = [
  colors.brand.pink,
  colors.brand.yellow,
] as const;

export function audienceLabel(audience: string | null | undefined): string {
  if (!audience) return 'Moment';
  return AUDIENCE_LABEL[audience] ?? 'Moment';
}
