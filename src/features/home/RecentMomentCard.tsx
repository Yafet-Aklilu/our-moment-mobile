import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';
import { coverImageUrl } from '@/utils/coverImage';

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

/**
 * Recent Moment row — cover-led, warm, not a dense list cell.
 */
export function RecentMomentCard({ moment }: { moment: MomentSummary }) {
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const date = formatDate(moment.activated_at || moment.updated_at || moment.created_at);
  const cover = coverImageUrl(moment.template?.cover_image);
  const styleName = moment.template?.title || moment.template?.name || 'Moment';

  return (
    <Link href={`/(app)/moments/${moment.id}`} asChild>
      <Pressable>
        <View style={[styles.card, shadows.card]}>
          {cover ? (
            <Image source={{ uri: cover }} style={styles.cover} contentFit="cover" transition={200} />
          ) : (
            <LinearGradient
              colors={[colors.brand.pink, colors.brand.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.cover, styles.coverFallback]}
            >
              <Ionicons name="heart" size={22} color="#fff" />
            </LinearGradient>
          )}

          <View style={styles.main}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <MomentStatusPill state={moment.state} compact />
            </View>
            <Text style={styles.meta} numberOfLines={1}>
              {styleName}
              {date ? ` · ${date}` : ''}
            </Text>
            {moment.reactions_count > 0 ? (
              <Text style={styles.reactions}>
                {moment.reactions_count} reaction
                {moment.reactions_count === 1 ? '' : 's'}
              </Text>
            ) : (
              <Text style={styles.hint}>
                {moment.state === 'draft' ? 'Tap to continue' : 'Tap to open'}
              </Text>
            )}
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.light.textMuted} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.sm,
    paddingRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cover: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surfaceMuted,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.subtitle,
    flex: 1,
    fontSize: 16,
    color: '#2a1f24',
  },
  meta: {
    ...typography.caption,
    color: '#6b5560',
  },
  reactions: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 12,
  },
  hint: {
    ...typography.caption,
    color: colors.light.textMuted,
    fontSize: 12,
  },
});
