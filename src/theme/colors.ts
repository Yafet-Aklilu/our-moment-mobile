/**
 * OurMoment brand colors — mirrored from web:
 * - resources/js/Components/home/brand.js
 * - resources/css/app.css (--moment-* + landing surfaces)
 */
export const colors = {
  brand: {
    pink: '#FF6C71',
    yellow: '#FFBC3A',
    pinkDeep: '#E85A5F',
    charcoal: '#1C1814',
    soft: '#FFF5F0',
  },

  /** Warm light creator chrome (default app surface). */
  light: {
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceWarm: '#FFFBF8',
    surfaceMuted: '#FFF5F0',
    border: 'rgba(28, 24, 20, 0.08)',
    borderStrong: 'rgba(28, 24, 20, 0.14)',
    text: '#1C1814',
    textSecondary: 'rgba(28, 24, 20, 0.64)',
    textMuted: 'rgba(28, 24, 20, 0.44)',
    overlay: 'rgba(28, 24, 20, 0.45)',
    danger: '#D64545',
    success: '#2F9E6B',
    info: '#3B82C4',
  },

  /** Cinematic Moment player tokens (web --moment-*). */
  moment: {
    background: '#1A1218',
    surface: 'rgba(255, 255, 255, 0.08)',
    text: '#FFF5F0',
    textMuted: 'rgba(255, 245, 240, 0.72)',
    accent: '#FF6C71',
    accentAlt: '#FFBC3A',
  },

  /** Status badges — product states, not shipping UI. */
  status: {
    draftBg: 'rgba(255, 188, 58, 0.16)',
    draftText: '#A66B00',
    sentBg: 'rgba(47, 158, 107, 0.14)',
    sentText: '#1F7A4F',
  },

  tabBar: {
    background: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(28, 24, 20, 0.08)',
    activePill: '#1C1814',
    activeIcon: '#FFFFFF',
    inactiveIcon: 'rgba(28, 24, 20, 0.45)',
  },
} as const;

export type AppColors = typeof colors;
