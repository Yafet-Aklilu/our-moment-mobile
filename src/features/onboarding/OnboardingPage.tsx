import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { OnboardingSlide } from '@/features/onboarding/slides';
import { colors, motion, radii, spacing, typography } from '@/theme';

type Props = {
  slide: OnboardingSlide;
  index: number;
  active: boolean;
  scrollX: SharedValue<number>;
  width: number;
};

/**
 * Full-bleed photo + overlapping cream sheet with eyebrow / title / body.
 * Clear composition change vs a flat image + text stack.
 */
export function OnboardingPage({ slide, index, active, scrollX, width }: Props) {
  const { height } = useWindowDimensions();
  const imageHeight = Math.min(height * 0.62, 520);

  const imageStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, input, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(scrollX.value, input, [1.08, 1, 1.08], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={[styles.page, { width }]}>
      <Animated.View style={[styles.hero, { height: imageHeight }, imageStyle]}>
        <Image
          source={{ uri: slide.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={280}
          cachePolicy="memory-disk"
          accessibilityLabel={slide.imageCredit}
        />
        <LinearGradient
          colors={['rgba(28,24,20,0.15)', 'rgba(28,24,20,0.05)', 'transparent']}
          locations={[0, 0.35, 0.55]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <FadeSlideIn active={active}>
        <View style={styles.sheet}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </View>
      </FadeSlideIn>
    </View>
  );
}

function FadeSlideIn({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0.35, {
      duration: motion.duration.normal,
      easing: Easing.bezier(...motion.easing.out),
    });
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0.35, 1], [14, 0]) }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceMuted,
  },
  sheet: {
    marginTop: -36,
    marginHorizontal: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: '#1C1814',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand.pinkSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
    marginBottom: spacing.xxs,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    ...typography.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: '#2a1f24',
  },
  body: {
    ...typography.body,
    color: '#6b5560',
    fontSize: 16,
    lineHeight: 24,
  },
});
