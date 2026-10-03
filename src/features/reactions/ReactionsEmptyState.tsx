import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { colors, motion, spacing, typography } from '@/theme';

/**
 * Centered empty state for Reactions — aligned with My Moments empty pattern.
 */
export function ReactionsEmptyState() {
  return (
    <Animated.View entering={FadeIn.duration(motion.duration.normal)} style={styles.wrap}>
      <View style={styles.iconRing}>
        <LinearGradient
          colors={[colors.brand.pink, colors.brand.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.title}>No reactions yet</Text>
      <Text style={styles.body}>
        Create a Moment and share it to receive a reaction.
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
    shadowColor: colors.brand.pink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
  iconGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
});
