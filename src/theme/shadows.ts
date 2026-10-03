import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#FF6C71',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    android: { elevation: 3 },
    default: {},
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1C1814',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: { elevation: 2 },
    default: {},
  }),
  tabBar: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1C1814',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
    },
    android: { elevation: 8 },
    default: {},
  }),
  cta: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#FF6C71',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
    },
    android: { elevation: 4 },
    default: {},
  }),
} as const;
