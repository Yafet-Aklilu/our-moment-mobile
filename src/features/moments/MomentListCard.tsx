import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/animation/PressableScale';
import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, motion, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';
import { coverImageUrl } from '@/utils/coverImage';

function formatDate(iso: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

type Props = {
  moment: MomentSummary;
  index?: number;
};

/**
 * List card → Moment details (edit / preview / activate / share live there).
 */
export function MomentListCard({ moment, index = 0 }: Props) {
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const styleName = moment.template?.title || moment.template?.name || 'Style';
  const cover = coverImageUrl(moment.template?.cover_image);
  const date = formatDate(moment.activated_at || moment.updated_at || moment.created_at);
  const isDraft = moment.state === 'draft';

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 6) * 40)
        .duration(motion.duration.normal)
        .springify()}
    >
      <Link href={`/(app)/moments/${moment.id}`} asChild>
        <PressableScale>
          <View style={[styles.card, shadows.card]}>
            <View style={styles.top}>
              {cover ? (
                <Image
                  source={{ uri: cover }}
                  style={styles.cover}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={[styles.cover, styles.coverFallback]}>
                  <Ionicons name="heart" size={20} color={colors.brand.pink} />
                </View>
              )}

              <View style={styles.main}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                  <MomentStatusPill state={moment.state} compact />
                </View>
                <Text style={styles.styleName} numberOfLines={1}>
                  {styleName}
                </Text>
                <View style={styles.metaRow}>
                  {date ? <Text style={styles.meta}>{date}</Text> : null}
                  {moment.reactions_count > 0 ? (
                    <Text style={styles.reactions}>
                      {moment.reactions_count} reaction
                      {moment.reactions_count === 1 ? '' : 's'}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.hint}>
                {isDraft
                  ? 'Still editing — tap to continue'
                  : moment.public_share_url
                    ? 'Sent — share or view details'
                    : 'Sent'}
              </Text>
              <View style={styles.actionChip}>
                <Text style={styles.actionText}>
                  {isDraft ? 'Continue' : 'Open'}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.brand.pinkDeep}
                />
              </View>
            </View>
          </View>
        </PressableScale>
      </Link>
    </Animated.View>
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
    gap: spacing.md,
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.light.surfaceMuted,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,108,113,0.12)',
  },
  main: {
    flex: 1,
    gap: 4,
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
    fontSize: 17,
  },
  styleName: {
    ...typography.caption,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.light.textMuted,
  },
  reactions: {
    ...typography.label,
    fontSize: 12,
    color: colors.brand.pinkDeep,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  hint: {
    ...typography.caption,
    flex: 1,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 13,
  },
});
