import { colors } from './colors';
import { motion } from './motion';
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
};
