/**
 * OurMoment mobile design foundation.
 *
 * Visual source of truth: redesigned web app
 * (brand.js + .landing-light tokens — cream foundation, pink→yellow CTAs).
 *
 * Use `theme` for tokens. Prefer shared UI in `src/components/ui/`
 * (Button, TextField, Screen/Card, LoadingState, ErrorState, EmptyState, ScreenHeader)
 * over one-off chrome so the app stays one product with the web.
 */
import { colors } from './colors';
import { motion } from './motion';
import { warmStackScreenOptions, warmTabHeaderOptions } from './navigation';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing, touchMin } from './spacing';
import { fontFamilies, typography } from './typography';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  radii,
  shadows,
  motion,
  touchMin,
  brandGradient: {
    colors: [colors.brand.pink, colors.brand.yellow] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

export type Theme = typeof theme;

export {
  colors,
  typography,
  fontFamilies,
  spacing,
  touchMin,
  radii,
  shadows,
  motion,
  warmStackScreenOptions,
  warmTabHeaderOptions,
};
