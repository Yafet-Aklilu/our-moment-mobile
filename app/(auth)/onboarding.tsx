import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { ONBOARDING_SLIDES } from '@/features/onboarding/slides';
import { useOnboardingStore } from '@/state/onboardingStore';
import { colors, motion, radii, spacing, typography } from '@/theme';

function Pagination({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} active={i === index} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, motion.spring.tab);
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    width: 8 + progress.value * 18,
    opacity: 0.35 + progress.value * 0.65,
    backgroundColor: colors.brand.pink,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * First-run product introduction — image pages + cream sheet + pink→yellow CTA.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const complete = useOnboardingStore((s) => s.complete);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const last = ONBOARDING_SLIDES.length - 1;

  const finish = useCallback(async () => {
    await complete();
    router.replace('/(auth)/welcome');
  }, [complete, router]);

  const goNext = useCallback(() => {
    void Haptics.selectionAsync();
    if (index >= last) {
      void finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  }, [finish, index, last, width]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(next);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.brandChip}>
          <BrandMark size="sm" horizontal />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={12}
          onPress={() => void finish()}
          style={styles.skipPill}
        >
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumEnd}
        style={styles.pager}
      >
        {ONBOARDING_SLIDES.map((slide, i) => (
          <OnboardingPage
            key={slide.id}
            slide={slide}
            index={i}
            active={i === index}
            scrollX={scrollX}
            width={width}
          />
        ))}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
        ]}
      >
        <Pagination count={ONBOARDING_SLIDES.length} index={index} />
        <Button
          label={index >= last ? 'Start creating' : 'Continue'}
          onPress={goNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandChip: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  skipPill: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  skip: {
    ...typography.label,
    color: colors.light.text,
  },
  pager: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.light.background,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 20,
  },
  dot: {
    height: 8,
    borderRadius: radii.pill,
  },
});
