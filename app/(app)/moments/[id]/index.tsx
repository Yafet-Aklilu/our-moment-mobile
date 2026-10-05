import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMomentQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageIntro } from '@/components/ui/PageIntro';
import { Card } from '@/components/ui/Screen';
import { MomentStatusPill } from '@/features/home/MomentStatusPill';
import { colors, radii, spacing, typography } from '@/theme';
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

/**
 * Moment hub — continue editing, preview, activate, or share.
 * Visual language matches Home / Moments list cards.
 */
export default function MomentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const query = useMomentQuery(momentId);
  const insets = useSafeAreaInsets();

  if (query.isLoading) {
    return <LoadingState label="Opening your Moment…" />;
  }

  if (query.isError || !query.data) {
    return (
      <ErrorState
        title="Moment not found"
        body="It may have been deleted, or the link is no longer valid."
        actionLabel="Try again"
        onAction={() => void query.refetch()}
      />
    );
  }

  const moment = query.data;
  const isDraft = moment.state === 'draft';
  const title = moment.receiver_name?.trim() || 'Untitled moment';
  const styleName = moment.template?.title || moment.template?.name || 'Style';
  const cover = coverImageUrl(moment.template?.cover_image);
  const date = formatDate(moment.activated_at || moment.updated_at || moment.created_at);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.hero} muted borderless>
        <View style={styles.heroTop}>
          {cover ? (
            <Image source={{ uri: cover }} style={styles.cover} contentFit="cover" transition={200} />
          ) : (
            <View style={[styles.cover, styles.coverFallback]}>
              <Ionicons name="heart" size={28} color={colors.brand.pink} />
            </View>
          )}
          <View style={styles.heroMain}>
            <MomentStatusPill state={moment.state} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.styleName}>{styleName}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>From</Text>
            <Text style={styles.metaValue}>{moment.sender_name?.trim() || 'You'}</Text>
          </View>
          {date ? (
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>{isDraft ? 'Updated' : 'Sent'}</Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>
          ) : null}
          {moment.reactions_count > 0 ? (
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Reactions</Text>
              <Text style={styles.metaValue}>{moment.reactions_count}</Text>
            </View>
          ) : null}
        </View>
      </Card>

      <PageIntro
        eyebrow={isDraft ? 'Almost there' : 'It’s live'}
        body={
          isDraft
            ? 'Polish the details, preview how it feels, then activate when you’re ready to send.'
            : 'This Moment is live. Share the private link, or open it the way they will.'
        }
        style={styles.intro}
      />

      <View style={styles.actions}>
        {isDraft ? (
          <>
            <Link href={`/(app)/moments/${moment.id}/edit`} asChild>
              <Button label="Continue editing" />
            </Link>
            <Link href={`/(app)/moments/${moment.id}/preview`} asChild>
              <Button label="Preview Moment" variant="secondary" />
            </Link>
            <Link href={`/(app)/moments/${moment.id}/activate`} asChild>
              <Button label="Activate & send" variant="soft" />
            </Link>
          </>
        ) : (
          <>
            <Link href={`/(app)/moments/${moment.id}/share`} asChild>
              <Button label="Share link" />
            </Link>
            {moment.public_token ? (
              <Link href={`/player/${moment.public_token}`} asChild>
                <Button label="Open Moment" variant="secondary" />
              </Link>
            ) : null}
            <Link href={`/(app)/moments/${moment.id}/preview`} asChild>
              <Button label="Preview again" variant="ghost" />
            </Link>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.md,
    backgroundColor: colors.light.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  heroTop: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cover: {
    width: 92,
    height: 92,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surfaceMuted,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.pinkSoft,
  },
  heroMain: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    ...typography.titleSmall,
  },
  styleName: {
    ...typography.caption,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  metaCol: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.light.textMuted,
  },
  metaValue: {
    ...typography.label,
    color: colors.light.text,
  },
  intro: {
    marginBottom: 0,
  },
  actions: {
    gap: spacing.sm,
  },
});
