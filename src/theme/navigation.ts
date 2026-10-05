import { colors } from './colors';
import { fontFamilies } from './typography';

/**
 * Shared warm stack header options — cream + Jakarta brand chrome.
 * Typed loosely so we don't depend on a separate native-stack types package
 * (Expo Router already bundles navigation).
 */
export const warmStackScreenOptions = {
  headerShadowVisible: false,
  headerTintColor: colors.brand.pinkDeep,
  headerStyle: {
    backgroundColor: colors.light.background,
  },
  headerTitleStyle: {
    fontFamily: fontFamilies.headlineSemi,
    fontSize: 17,
    color: colors.light.text,
  },
  headerBackTitle: '',
  contentStyle: {
    backgroundColor: colors.light.background,
  },
  animation: 'slide_from_right' as const,
};

export const warmTabHeaderOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.light.background },
  headerTitleStyle: {
    fontFamily: fontFamilies.headlineSemi,
    fontSize: 20,
    color: colors.light.text,
  },
  headerLargeTitle: false,
};
