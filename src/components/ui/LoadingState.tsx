import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { BrandMark } from '@/components/ui/BrandMark';
import { colors, motion, spacing, typography } from '@/theme';

type Props = {
  label?: string;
  /** Full pink→yellow branded splash (boot / first paint). */
  branded?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Loading chrome. Branded mode = true splash: gradient wash + large mark + tagline.
 */
export function LoadingState({ label, branded = false, style }: Props) {
  if (branded) {
    return (
      <View style={[styles.splashRoot, style]}>
        <LinearGradient
          colors={[colors.brand.pink, '#FF8A4C', colors.brand.yellow]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={[styles.orb, styles.orbA]} />
        <View pointerEvents="none" style={[styles.orb, styles.orbB]} />

        <Animated.View entering={FadeIn.duration(motion.duration.slow)} style={styles.splashCenter}>
          <BrandMark size="lg" />
          <Animated.View entering={FadeInUp.delay(120).duration(motion.duration.normal)}>
            <Text style={styles.splashWordmark}>OurMoment</Text>
            <Text style={styles.splashTagline}>
              {label ?? 'Moments made to be felt.'}
            </Text>
          </Animated.View>
        </Animated.View>

        <ActivityIndicator color="#FFFFFF" style={styles.splashSpinner} />
      </View>
    );
  }

  return (
    <View style={[styles.root, style]}>
      <ActivityIndicator color={colors.brand.pink} size="large" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
  },
  splashRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.pink,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  orbA: {
    width: 260,
    height: 260,
    top: -50,
    right: -70,
  },
  orbB: {
    width: 200,
    height: 200,
    bottom: 60,
    left: -60,
  },
  splashCenter: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  splashWordmark: {
    ...typography.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  splashTagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 22,
  },
  splashSpinner: {
    position: 'absolute',
    bottom: 72,
  },
  label: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
});
