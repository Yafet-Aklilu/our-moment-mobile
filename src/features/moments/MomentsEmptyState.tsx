import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { EmptyState } from '@/components/ui/EmptyState';
import { colors, motion, radii, spacing } from '@/theme';

type Props = {
  filtered?: boolean;
  filterLabel?: string;
  onClearFilter?: () => void;
};

export function MomentsEmptyState({ filtered, filterLabel, onClearFilter }: Props) {
  const router = useRouter();

  if (filtered) {
    const body =
      `Nothing in “${filterLabel}” right now.` +
      (filterLabel === 'Sent'
        ? ' When you activate and send a Moment, it will show up here.'
        : ' Try another filter or create a new Moment.');

    return (
      <Animated.View entering={FadeIn.duration(motion.duration.normal)}>
        <EmptyState
          icon="search-outline"
          title="No matching Moments"
          body={body}
          actionLabel={filterLabel !== 'Sent' ? 'Create a Moment' : onClearFilter ? 'Show all' : undefined}
          onAction={
            filterLabel !== 'Sent'
              ? () => router.push('/(app)/(tabs)/create')
              : onClearFilter
          }
          secondaryLabel={
            filterLabel !== 'Sent' && onClearFilter ? 'Show all' : undefined
          }
          onSecondary={filterLabel !== 'Sent' && onClearFilter ? onClearFilter : undefined}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(motion.duration.normal)} style={styles.wrap}>
      <LinearGradient
        colors={[colors.brand.soft, colors.light.surfaceWarm, '#FFFFFF']}
        style={styles.wash}
      >
        <EmptyState
          icon="heart"
          eyebrow="My Moments"
          title="No Moments yet"
          body="Choose a style and start creating your first Moment — something they’ll open and keep."
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
    marginTop: spacing.md,
  },
  wash: {
    paddingVertical: spacing.md,
  },
});
