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
import { colors, motion, spacing, typography } from '@/theme';

type Props = {
  slide: OnboardingSlide;
  index: number;
  active: boolean;
  scrollX: SharedValue<number>;
  width: number;
};

export function OnboardingPage({ slide, index, active, scrollX, width }: Props) {
  const { height } = useWindowDimensions();
  const imageHeight = Math.min(height * 0.58, 480);

  const imageStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, input, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(scrollX.value, input, [1.06, 1, 1.06], Extrapolation.CLAMP),
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
          colors={['rgba(250,247,242,0)', 'rgba(250,247,242,0.55)', colors.light.background]}
          locations={[0.35, 0.72, 1]}
          style={styles.fade}
        />
      </Animated.View>

      <FadeSlideIn active={active}>
        <View style={styles.copy}>
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
    transform: [{ translateY: interpolate(progress.value, [0.35, 1], [8, 0]) }],
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
  fade: {
    ...StyleSheet.absoluteFill,
  },
  copy: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});
