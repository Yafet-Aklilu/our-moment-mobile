import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { env } from '@/config/env';
import { ONBOARDING_SLIDES } from '@/features/onboarding/slides';
import { colors, motion, radii, shadows, spacing, typography } from '@/theme';

/**
 * Auth choice after onboarding.
 * Composition: full-bleed photo → overlapping white card with brand + CTAs
 * on a soft cream footer — clearly not a generic auth landing.
 */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(height * 0.52, 460);
  const hero = ONBOARDING_SLIDES[0];

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image
          source={{ uri: hero.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={240}
          cachePolicy="memory-disk"
        />
        <LinearGradient
          colors={['rgba(28,24,20,0.25)', 'transparent', colors.light.background]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.heroBrand, { top: insets.top + spacing.sm }]}>
          <BrandMark size="sm" horizontal />
        </View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(motion.duration.normal).springify()}
        style={[
          styles.card,
          shadows.soft,
          { marginBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
        ]}
      >
        <View style={styles.accentBar} />
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.headline}>Ready to create a Moment?</Text>
        <Text style={styles.sub}>
          Create for free. Pay only when you’re ready to send something beautiful.
        </Text>

        <View style={styles.actions}>
          <Link href="/(auth)/register" asChild>
            <Button label="Create an account" />
          </Link>
          <Link href="/(auth)/login" asChild>
            <Button label="Log in" variant="secondary" />
          </Link>
        </View>

        <View style={styles.legal}>
          <Text
            style={styles.legalLink}
            onPress={() => void Linking.openURL(`${env.webOrigin}/privacy`)}
          >
            Privacy
          </Text>
          <Text style={styles.legalDot}>·</Text>
          <Text
            style={styles.legalLink}
            onPress={() => void Linking.openURL(`${env.webOrigin}/terms`)}
          >
            Terms
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
    justifyContent: 'space-between',
  },
  hero: {
    width: '100%',
    backgroundColor: colors.light.surfaceMuted,
  },
  heroBrand: {
    position: 'absolute',
    left: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  card: {
    marginTop: -56,
    marginHorizontal: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.brand.pink,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  headline: {
    ...typography.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: '#2a1f24',
    marginBottom: spacing.sm,
  },
  sub: {
    ...typography.body,
    color: '#6b5560',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.sm,
  },
  legal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  legalLink: {
    ...typography.caption,
    color: colors.light.textMuted,
  },
  legalDot: {
    ...typography.caption,
    color: colors.light.textMuted,
  },
});
