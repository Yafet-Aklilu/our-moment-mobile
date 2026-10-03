import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';

function formatDate(iso: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function RecentMomentCard({ moment }: { moment: MomentSummary }) {
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const date = formatDate(moment.activated_at || moment.updated_at || moment.created_at);

  return (
    <Link href={`/(app)/moments/${moment.id}`} asChild>
      <Pressable>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <MomentStatusPill state={moment.state} compact />
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaText} numberOfLines={1}>
              {moment.template?.title || moment.template?.name || 'Moment'}
            </Text>
            {date ? <Text style={styles.metaText}>{date}</Text> : null}
          </View>
          {moment.reactions_count > 0 ? (
            <Text style={styles.reactions}>
              {moment.reactions_count} reaction
              {moment.reactions_count === 1 ? '' : 's'}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    flex: 1,
    fontSize: 16,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaText: {
    ...typography.caption,
  },
  reactions: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 12,
  },
});
