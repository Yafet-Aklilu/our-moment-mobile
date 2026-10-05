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
 * Primary Create surface — pink→yellow wash (web brand language),
 * full-width Create CTA, quiet secondary path.
 */
export function HomeHeroCard({ credits, hasDraft }: Props) {
  return (
    <View style={[styles.wrap, shadows.soft]}>
      <LinearGradient
        colors={[colors.brand.pink, '#FF8A4C', colors.brand.yellow]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.orb} />
        <Text style={styles.kicker}>Your next Moment</Text>
        <Text style={styles.headline}>Make something they’ll remember</Text>
        <Text style={styles.blurb}>
          Create for free. Pay only when you’re ready to send.
        </Text>

        <Link href="/(app)/(tabs)/create" asChild>
          <PressableScale style={styles.primaryAction}>
            <View style={styles.primaryInner}>
              <Ionicons name="sparkles" size={18} color={colors.brand.pinkDeep} />
              <Text style={styles.primaryLabel}>Create a Moment</Text>
            </View>
          </PressableScale>
        </Link>

        <View style={styles.footerRow}>
          <View style={styles.creditsPill}>
            <Text style={styles.creditsLabel}>Credits</Text>
            <Text style={styles.creditsValue}>{credits == null ? '—' : credits}</Text>
          </View>

          <Link href={hasDraft ? '/(app)/(tabs)/moments' : '/(app)/scan'} asChild>
            <PressableScale style={styles.secondaryAction}>
              <Ionicons
                name={hasDraft ? 'heart-outline' : 'qr-code-outline'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.secondaryLabel}>
                {hasDraft ? 'My Moments' : 'Scan'}
              </Text>
            </PressableScale>
          </Link>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.xl,
    gap: spacing.sm,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  orb: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  kicker: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  headline: {
    ...typography.display,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: '#FFFFFF',
    maxWidth: 280,
  },
  blurb: {
    ...typography.body,
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  primaryAction: {
    borderRadius: radii.button,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  primaryInner: {
    minHeight: 54,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
  },
  primaryLabel: {
    ...typography.button,
    color: '#2a1f24',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  creditsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  creditsLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  creditsValue: {
    ...typography.label,
    color: '#FFFFFF',
    fontSize: 15,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondaryLabel: {
    ...typography.label,
    color: '#FFFFFF',
    fontSize: 13,
  },
});
