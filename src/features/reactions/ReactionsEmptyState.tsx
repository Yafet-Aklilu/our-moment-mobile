import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { EmptyState } from '@/components/ui/EmptyState';
import { colors, motion, radii, spacing } from '@/theme';

/**
 * Centered empty state for Reactions — warm, inviting, not analytics.
 */
export function ReactionsEmptyState() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeIn.duration(motion.duration.normal)} style={styles.wrap}>
      <LinearGradient
        colors={[colors.brand.soft, colors.light.surfaceWarm, '#FFFFFF']}
        style={styles.wash}
      >
        <EmptyState
          icon="chatbubble-ellipses"
          eyebrow="Reactions"
          title="No replies yet"
          body="Share a Moment privately. When they open it and respond, their feeling will land here."
          actionLabel="Create a Moment"
          onAction={() => router.push('/(app)/(tabs)/create')}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  wash: {
    paddingVertical: spacing.md,
  },
});
