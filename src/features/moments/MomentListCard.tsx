import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
 * My Moments card — cover-forward experience, not a file row.
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
            <View style={styles.coverWrap}>
              {cover ? (
                <Image
                  source={{ uri: cover }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  transition={220}
                />
              ) : (
                <LinearGradient
                  colors={[colors.brand.pink, colors.brand.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(28,24,20,0.5)']}
                style={styles.coverFade}
              />
              <View style={styles.coverBadge}>
                <MomentStatusPill state={moment.state} compact />
              </View>
              <Text style={styles.coverTitle} numberOfLines={2}>
                {title}
              </Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.styleName} numberOfLines={1}>
                {styleName}
                {date ? ` · ${date}` : ''}
              </Text>

              <View style={styles.footer}>
                <Text style={styles.hint}>
                  {isDraft
                    ? 'Still shaping this Moment'
                    : moment.reactions_count > 0
                      ? `${moment.reactions_count} reaction${moment.reactions_count === 1 ? '' : 's'}`
                      : 'Sent — waiting for a reply'}
                </Text>
                <View style={styles.actionChip}>
                  <Text style={styles.actionText}>{isDraft ? 'Continue' : 'Open'}</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.brand.pinkDeep} />
                </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  coverWrap: {
    height: 140,
    justifyContent: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.light.surfaceMuted,
  },
  coverFade: {
    ...StyleSheet.absoluteFill,
  },
  coverBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  coverTitle: {
    ...typography.titleSmall,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  styleName: {
    ...typography.caption,
    color: '#6b5560',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
    flex: 1,
    color: colors.light.textSecondary,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand.pinkSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  actionText: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 13,
  },
});
