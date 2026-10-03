/**
 * Approximate a MomentConfig's CSS theme (see `MomentConfigBuilder`'s
 * `BACKGROUND_THEME_MAP`) for native `LinearGradient` rendering.
 *
 * `theme.background` is a full CSS `radial-gradient(...), linear-gradient(...)`
 * string — not directly usable by `expo-linear-gradient`. We pull the hex
 * stops out of it and feed those to `LinearGradient` as a reasonable warm/
 * cinematic approximation, per the migration brief ("approx with
 * LinearGradient using theme.background/primary/text").
 */
import { colors } from '@/theme';

import type { MomentTheme } from './momentConfig';

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;

export function extractGradientHexColors(css: string | null | undefined): string[] {
  if (!css || typeof css !== 'string') return [];
  const matches = css.match(HEX_PATTERN) ?? [];
  const seen = new Set<string>();
  const unique: string[] = [];
  matches.forEach((hex) => {
    const key = hex.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(hex);
    }
  });
  return unique;
}

export type NativeMomentTheme = {
  /** At least two stops, ready for `<LinearGradient colors={...} />`. */
  backgroundColors: [string, string, ...string[]];
  textColor: string;
  /** Muted variant of `textColor` for eyebrows / captions / hints. */
  mutedColor: string;
  accentColor: string;
};

const FALLBACK_GRADIENT: [string, string] = [colors.moment.background, '#241423'];

/** `#RGB` / `#RRGGBB` -> `rgba(r, g, b, alpha)`. Returns the input unchanged otherwise. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.trim();
  const isShort = /^#([0-9a-f]{3})$/i.test(value);
  const isLong = /^#([0-9a-f]{6})$/i.test(value);
  if (!isShort && !isLong) return value;

  const full = isShort
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value;
  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function resolveNativeMomentTheme(theme: MomentTheme | null | undefined): NativeMomentTheme {
  const extracted = extractGradientHexColors(theme?.background);

  let backgroundColors: [string, string, ...string[]];
  if (extracted.length >= 2) {
    backgroundColors = extracted as [string, string, ...string[]];
  } else if (extracted.length === 1) {
    backgroundColors = [extracted[0], colors.moment.background];
  } else {
    backgroundColors = FALLBACK_GRADIENT;
  }

  const textColor =
    typeof theme?.text === 'string' && theme.text.trim() ? theme.text : colors.moment.text;
  const accentColor =
    typeof theme?.primary === 'string' && theme.primary.trim() ? theme.primary : colors.moment.accent;

  return { backgroundColors, textColor, mutedColor: withAlpha(textColor, 0.72), accentColor };
}
