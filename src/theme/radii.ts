/**
 * Radii inspired by web landing (sm/md/lg/xl rem scale),
 * translated for native density — not pixel-copied from reference UIs.
 *
 * Primary CTAs use `button` (~web rounded-2xl), not full pills.
 * Reserve `pill` for chips, status badges, and tab indicators.
 */
export const radii = {
  sm: 12,
  md: 16,
  /** Matches web brand CTA `rounded-2xl` feel */
  button: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
  tabBar: 28,
  tabPill: 22,
} as const;
