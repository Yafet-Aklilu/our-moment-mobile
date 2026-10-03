import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { colors, motion, radii, spacing, typography } from '@/theme';

type Props = {
  /** When a state filter yields no results */
  filtered?: boolean;
  filterLabel?: string;
  onClearFilter?: () => void;
};

/**
 * Centered empty state for My Moments.
 * Exact product copy when unfiltered; clear-filter path when filtered.
 */
export function MomentsEmptyState({ filtered, filterLabel, onClearFilter }: Props) {
  if (filtered) {
    return (
      <Animated.View entering={FadeIn.duration(motion.duration.normal)} style={styles.wrap}>
        <View style={styles.icon}>
          <Ionicons name="search-outline" size={28} color={colors.brand.pinkDeep} />
        </View>
        <Text style={styles.title}>No matching Moments</Text>
        <Text style={styles.body}>
          Nothing in “{filterLabel}” right now.
          {filterLabel === 'Sent'
            ? ' When you activate and send a Moment, it will show up here.'
            : ' Try another filter or create a new Moment.'}
        </Text>
        <View style={styles.actions}>
          {onClearFilter ? (
            <Button label="Show all moments" variant="secondary" onPress={onClearFilter} />
          ) : null}
          {filterLabel !== 'Sent' ? (
            <Link href="/(app)/(tabs)/create" asChild>
              <Button label="Create a Moment" />
            </Link>
          ) : null}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(motion.duration.normal)} style={styles.wrap}>
      <View style={styles.iconRing}>
        <LinearGradient
          colors={[colors.brand.pink, colors.brand.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name="heart-outline" size={32} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.title}>No Moments yet</Text>
      <Text style={styles.body}>
        Choose a style and start creating your first Moment.
      </Text>
      <Link href="/(app)/(tabs)/create" asChild>
        <Button label="Create a Moment" style={styles.cta} />
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 28,
    marginBottom: spacing.md,
    ...({
      shadowColor: colors.brand.pink,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 18,
      elevation: 6,
    } as const),
  },
  iconGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.md,
  },
  cta: {
    alignSelf: 'stretch',
    maxWidth: 320,
    width: '100%',
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.sm,
  },
});
