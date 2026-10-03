import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PressableScale } from '@/animation/PressableScale';
import { colors, radii, shadows, spacing, typography } from '@/theme';

type Props = {
  credits: number | null;
  hasDraft: boolean;
};

/**
 * Primary action center — reference "dark hero card" structure,
 * OurMoment charcoal + soft text + pink→yellow create CTA.
 */
export function HomeHeroCard({ credits, hasDraft }: Props) {
  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.topRow}>
        <View style={styles.creditsBlock}>
          <Text style={styles.creditsLabel}>Moment credits</Text>
          <Text style={styles.creditsValue}>
            {credits == null ? '—' : credits}
          </Text>
        </View>
        <View style={styles.spark}>
          <Ionicons name="sparkles" size={18} color={colors.brand.yellow} />
        </View>
      </View>

      <Text style={styles.blurb}>
        Create for free. Pay only when you’re ready to send.
      </Text>

      <View style={styles.actions}>
        <Link href="/(app)/(tabs)/create" asChild>
          <PressableScale style={styles.primaryAction}>
            <LinearGradient
              colors={[colors.brand.pink, colors.brand.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.primaryLabel}>Create a moment</Text>
            </LinearGradient>
          </PressableScale>
        </Link>

        <Link href={hasDraft ? '/(app)/(tabs)/moments' : '/(app)/scan'} asChild>
          <PressableScale style={styles.secondaryAction}>
            <Ionicons
              name={hasDraft ? 'heart-outline' : 'qr-code-outline'}
              size={18}
              color={colors.brand.soft}
            />
            <Text style={styles.secondaryLabel}>
              {hasDraft ? 'My moments' : 'Scan a Moment'}
            </Text>
          </PressableScale>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brand.charcoal,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  creditsBlock: {
    gap: 2,
  },
  creditsLabel: {
    ...typography.caption,
    color: 'rgba(255,245,240,0.62)',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  creditsValue: {
    ...typography.display,
    color: colors.brand.soft,
  },
  spark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,188,58,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurb: {
    ...typography.body,
    color: 'rgba(255,245,240,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1.2,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  primaryGradient: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.sm,
  },
  primaryLabel: {
    ...typography.button,
    color: '#fff',
    fontSize: 14,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255,245,240,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  secondaryLabel: {
    ...typography.button,
    color: colors.brand.soft,
    fontSize: 13,
  },
});
