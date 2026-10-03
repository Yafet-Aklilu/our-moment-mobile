/**
 * Central motion tokens — prefer these over one-off animation values.
 * Fast first, animated second. Respect reduced motion at call sites.
 */
export const motion = {
  duration: {
    instant: 100,
    fast: 180,
    normal: 280,
    slow: 420,
    tab: 240,
  },
  easing: {
    /** Soft ease-out for entrances */
    out: [0.16, 1, 0.3, 1] as const,
    /** Standard UI */
    standard: [0.2, 0.8, 0.2, 1] as const,
    /** Snappy press feedback */
    press: [0.3, 0.1, 0.3, 1] as const,
  },
  scale: {
    pressIn: 0.98,
    pressOut: 1,
  },
  spring: {
    tab: { damping: 18, stiffness: 220, mass: 0.8 },
    soft: { damping: 20, stiffness: 160, mass: 0.9 },
  },
} as const;
