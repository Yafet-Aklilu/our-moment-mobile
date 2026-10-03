import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { env } from '@/config/env';
import { ONBOARDING_SLIDES } from '@/features/onboarding/slides';
import { colors, spacing, typography } from '@/theme';

/**
 * Auth choice after onboarding (and landing for returning anonymous users).
 * Structure: image-led top + brand + stacked CTAs — warm OurMoment treatment
 * (not the dark reference chrome / social providers).
 */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(height * 0.48, 420);
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
          colors={['rgba(250,247,242,0)', 'rgba(250,247,242,0.7)', colors.light.background]}
          locations={[0.4, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.md },
        ]}
      >
        <View style={styles.brandBlock}>
          <BrandMark />
          <Text style={styles.brandName}>OurMoment</Text>
          <Text style={styles.headline}>Ready to create a Moment?</Text>
          <Text style={styles.sub}>
            Create for free. Pay only when you’re ready to send.
          </Text>
        </View>

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
            Privacy policy
          </Text>
          <Text style={styles.legalDot}>·</Text>
          <Text
            style={styles.legalLink}
            onPress={() => void Linking.openURL(`${env.webOrigin}/terms`)}
          >
            Terms of service
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  hero: {
    width: '100%',
    backgroundColor: colors.light.surfaceMuted,
  },
  sheet: {
    flex: 1,
    marginTop: -spacing.xxl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandName: {
    ...typography.title,
    color: colors.brand.pink,
    marginTop: spacing.xs,
  },
  headline: {
    ...typography.titleSmall,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  sub: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xl,
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
