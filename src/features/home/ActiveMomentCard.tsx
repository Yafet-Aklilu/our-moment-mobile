import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { JourneyStepper } from '@/features/home/JourneyStepper';
import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';
import { coverImageUrl } from '@/utils/coverImage';

type Props = {
  moment: MomentSummary;
};

/**
 * Featured Moment — image-led preview card (not a meta dashboard tile).
 */
export function ActiveMomentCard({ moment }: Props) {
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const styleName = moment.template?.title || moment.template?.name || 'Style';
  const cover = coverImageUrl(moment.template?.cover_image);
  const isDraft = moment.state === 'draft';

  return (
    <Link href={`/(app)/moments/${moment.id}`} asChild>
      <Pressable>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.coverWrap}>
            {cover ? (
              <Image
                source={{ uri: cover }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={240}
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
              colors={['transparent', 'rgba(28,24,20,0.55)']}
              style={styles.coverFade}
            />
            <View style={styles.coverTop}>
              <MomentStatusPill state={moment.state} />
            </View>
            <Text style={styles.coverTitle} numberOfLines={2}>
              {title}
            </Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.styleName} numberOfLines={1}>
              {styleName}
              {moment.sender_name?.trim() ? ` · From ${moment.sender_name.trim()}` : ''}
            </Text>

            {isDraft ? <JourneyStepper moment={moment} /> : null}

            {moment.reactions_count > 0 ? (
              <View style={styles.reactionRow}>
                <Ionicons name="heart" size={14} color={colors.brand.pinkDeep} />
                <Text style={styles.reactionText}>
                  {moment.reactions_count} reaction
                  {moment.reactions_count === 1 ? '' : 's'}
                </Text>
              </View>
            ) : null}

            <Text style={styles.cta}>
              {isDraft ? 'Continue editing →' : 'Open this Moment →'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
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
    height: 168,
    justifyContent: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.light.surfaceMuted,
  },
  coverFade: {
    ...StyleSheet.absoluteFill,
  },
  coverTop: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  coverTitle: {
    ...typography.titleSmall,
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  styleName: {
    ...typography.caption,
    color: '#6b5560',
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionText: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 13,
  },
  cta: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    marginTop: spacing.xxs,
  },
});
