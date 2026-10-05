import { forwardRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PressableScale } from '@/animation/PressableScale';
import { colors, radii, shadows, spacing, touchMin, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export const Button = forwardRef<View, Props>(function Button(
  {
    label,
    onPress,
    disabled,
    loading,
    variant = 'primary',
    style,
  },
  ref,
) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <PressableScale
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={isDisabled}
        onPress={onPress}
        style={[styles.base, styles.rounded, shadows.cta, isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[colors.brand.pink, colors.brand.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryLabel}>{label}</Text>
          )}
        </LinearGradient>
      </PressableScale>
    );
  }

  const shell =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'soft'
        ? styles.soft
        : styles.ghost;
  const labelStyle =
    variant === 'secondary'
      ? styles.secondaryLabel
      : variant === 'soft'
        ? styles.softLabel
        : styles.ghostLabel;

  return (
    <PressableScale
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.base, styles.rounded, shell, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.brand.pink} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  base: {
    minHeight: touchMin + 10,
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: radii.button,
  },
  gradient: {
    minHeight: touchMin + 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryLabel: {
    ...typography.button,
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  secondaryLabel: {
    ...typography.button,
    color: colors.light.text,
  },
  soft: {
    backgroundColor: colors.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  softLabel: {
    ...typography.button,
    color: colors.light.text,
  },
  ghost: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  ghostLabel: {
    ...typography.button,
    color: colors.brand.pinkDeep,
  },
  disabled: {
    opacity: 0.55,
  },
});
