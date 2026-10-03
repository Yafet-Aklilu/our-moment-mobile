import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, motion, radii, shadows, spacing, typography } from '@/theme';

type Props = {
  credits: number;
  freePublish?: boolean;
};

export function CreditsCard({ credits, freePublish }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(80).duration(motion.duration.normal).springify()}>
      <LinearGradient
        colors={[colors.brand.charcoal, '#2E2420']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, shadows.soft]}
      >
        <Text style={styles.label}>Moment credits</Text>
        <Text style={styles.value}>{credits}</Text>
        <Text style={styles.hint}>
          Use a credit to activate a Moment without paying again.
        </Text>
        {freePublish ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Free publish enabled</Text>
          </View>
        ) : null}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: 'rgba(255,245,240,0.62)',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  value: {
    ...typography.display,
    color: colors.brand.soft,
  },
  hint: {
    ...typography.body,
    color: 'rgba(255,245,240,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,188,58,0.22)',
  },
  badgeText: {
    ...typography.label,
    fontSize: 12,
    color: colors.brand.yellow,
  },
});
