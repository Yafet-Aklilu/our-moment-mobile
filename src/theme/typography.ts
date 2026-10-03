/**
 * Typography mapped from web fonts:
 * Plus Jakarta Sans (headlines) + Manrope (body/labels).
 * Player later: Lora / Great Vibes (not loaded in shell foundation).
 */
import { TextStyle } from 'react-native';

export const fontFamilies = {
  headline: 'PlusJakartaSans_700Bold',
  headlineSemi: 'PlusJakartaSans_600SemiBold',
  headlineMedium: 'PlusJakartaSans_500Medium',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

const base: TextStyle = {
  color: '#1C1814',
};

export const typography = {
  display: {
    ...base,
    fontFamily: fontFamilies.headline,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.4,
  } satisfies TextStyle,
  title: {
    ...base,
    fontFamily: fontFamilies.headline,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  titleSmall: {
    ...base,
    fontFamily: fontFamilies.headlineSemi,
    fontSize: 20,
    lineHeight: 28,
  } satisfies TextStyle,
  subtitle: {
    ...base,
    fontFamily: fontFamilies.bodySemi,
    fontSize: 17,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    ...base,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodyMedium: {
    ...base,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  label: {
    ...base,
    fontFamily: fontFamilies.bodySemi,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    ...base,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(28, 24, 20, 0.64)',
  } satisfies TextStyle,
  button: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
  } satisfies TextStyle,
} as const;
