import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMomentsQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { ReactionsEmptyState } from '@/features/reactions/ReactionsEmptyState';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import type { MomentSummary } from '@/types/api';

/**
 * Reactions inbox — moments that have received reactions.
 * Uses activated moments + reactions_count from the existing API.
 */
export default function ReactionsScreen() {
  const insets = useSafeAreaInsets();
  const moments = useMomentsQuery('activated');
  const withReactions =
    moments.data?.data?.filter((m) => m.reactions_count > 0) ?? [];

  if (moments.isLoading && !moments.data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (moments.isError && !moments.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn’t load reactions</Text>
        <Text style={styles.errorBody}>
          Check your connection and try again.
        </Text>
        <Button
          label="Try again"
          variant="secondary"
          onPress={() => void moments.refetch()}
        />
      </View>
    );
  }

  if (withReactions.length === 0) {
    return (
      <View
        style={[
          styles.screen,
          styles.emptyScreen,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <ReactionsEmptyState />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.intro}>
        See how people respond when they open your moments.
      </Text>
      <View style={styles.list}>
        {withReactions.map((m) => (
          <ReactionMomentRow key={m.id} moment={m} />
        ))}
      </View>
    </ScrollView>
  );
}

function ReactionMomentRow({ moment }: { moment: MomentSummary }) {
  const count = moment.reactions_count;
  return (
    <Link href={`/(app)/moments/${moment.id}`} asChild>
      <Pressable>
        <View style={[styles.row, shadows.card]}>
          <View style={styles.rowMain}>
            <Text style={styles.title} numberOfLines={1}>
              {moment.receiver_name?.trim() || 'Moment'}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {moment.template?.title || moment.template?.name || 'Sent Moment'}
            </Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {count} reaction{count === 1 ? '' : 's'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  emptyScreen: {
    paddingHorizontal: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
  },
  intro: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  rowMain: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    ...typography.subtitle,
  },
  meta: {
    ...typography.caption,
  },
  countPill: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,108,113,0.12)',
  },
  countText: {
    ...typography.label,
    fontSize: 12,
    color: colors.brand.pinkDeep,
  },
  errorTitle: {
    ...typography.titleSmall,
    textAlign: 'center',
  },
  errorBody: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
