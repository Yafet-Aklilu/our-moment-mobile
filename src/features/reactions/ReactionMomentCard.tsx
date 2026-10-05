import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';
import { coverImageUrl } from '@/utils/coverImage';

function formatRelative(iso: string | null) {
  if (!iso) return '';
  try {
    const then = new Date(iso).getTime();
    const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

type Props = {
  moment: MomentSummary;
};

/**
 * Reaction inbox card — personal and emotional, not an analytics row.
 */
export function ReactionMomentCard({ moment }: Props) {
  const router = useRouter();
  const count = moment.reactions_count;
  const title = moment.receiver_name?.trim() || 'Your Moment';
  const styleName = moment.template?.title || moment.template?.name || 'Sent Moment';
  const cover = coverImageUrl(moment.template?.cover_image);
  const when = formatRelative(moment.activated_at || moment.updated_at);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/(app)/moments/${moment.id}`)}
    >
      <View style={[styles.card, shadows.card]}>
        <View style={styles.coverWrap}>
          {cover ? (
            <Image
              source={{ uri: cover }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <LinearGradient
              colors={[colors.brand.pink, colors.brand.yellow]}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>

        <View style={styles.main}>
          <Text style={styles.eyebrow}>
            {count === 1 ? 'Someone responded' : `${count} responses`}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            For {title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {styleName}
            {when ? ` · ${when}` : ''}
          </Text>
          <View style={styles.ctaRow}>
            <Ionicons name="heart" size={14} color={colors.brand.pinkDeep} />
            <Text style={styles.cta}>See how they felt</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  coverWrap: {
    width: 84,
    height: 84,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceMuted,
  },
  main: {
    flex: 1,
    gap: 3,
    minWidth: 0,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xs,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.3,
    fontSize: 12,
  },
  title: {
    ...typography.subtitle,
    fontSize: 17,
    color: '#2a1f24',
  },
  meta: {
    ...typography.caption,
    color: '#6b5560',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cta: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 13,
  },
});
