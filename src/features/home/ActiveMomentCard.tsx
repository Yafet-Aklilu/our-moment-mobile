import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { JourneyStepper } from '@/features/home/JourneyStepper';
import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';

type Props = {
  moment: MomentSummary;
};

export function ActiveMomentCard({ moment }: Props) {
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const styleName = moment.template?.title || moment.template?.name || 'Style';

  return (
    <Link href={`/(app)/moments/${moment.id}`} asChild>
      <Pressable>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.top}>
            <View style={styles.titleCol}>
              <Text style={styles.kicker}>In progress</Text>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <MomentStatusPill state={moment.state} />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Style</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {styleName}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>From</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {moment.sender_name?.trim() || 'You'}
              </Text>
            </View>
          </View>

          <JourneyStepper moment={moment} />

          <Text style={styles.cta}>
            {moment.state === 'draft' ? 'Continue editing →' : 'Open moment →'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: spacing.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  kicker: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  title: {
    ...typography.subtitle,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaCol: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    ...typography.caption,
    fontSize: 11,
  },
  metaValue: {
    ...typography.label,
  },
  cta: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    marginTop: spacing.xs,
  },
});
