import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMomentsQuery } from '@/api/hooks/useMoments';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ReactionMomentCard } from '@/features/reactions/ReactionMomentCard';
import { ReactionsEmptyState } from '@/features/reactions/ReactionsEmptyState';
import { colors, spacing, typography } from '@/theme';

/**
 * Reactions — personal replies to Moments you’ve sent.
 * Runtime: ReactionMomentCard list OR ReactionsEmptyState.
 * Data: activated moments with reactions_count > 0 (existing API).
 */
export default function ReactionsScreen() {
  const insets = useSafeAreaInsets();
  const moments = useMomentsQuery('activated');
  const withReactions =
    moments.data?.data?.filter((m) => m.reactions_count > 0) ?? [];

  if (moments.isLoading && !moments.data) {
    return <LoadingState label="Gathering replies…" />;
  }

  if (moments.isError && !moments.data) {
    return (
      <ErrorState
        title="Couldn’t load reactions"
        body="Check your connection and try again."
        onAction={() => void moments.refetch()}
      />
    );
  }

  if (withReactions.length === 0) {
    return (
      <View
        style={[
          styles.screen,
          styles.emptyScreen,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + 100,
          },
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
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + 110,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>Replies</Text>
      <Text style={styles.title}>How they felt</Text>
      <Text style={styles.intro}>
        When someone opens your Moment and responds, it shows up here — softly, personally.
      </Text>

      <View style={styles.list}>
        {withReactions.map((m) => (
          <ReactionMomentCard key={m.id} moment={m} />
        ))}
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
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  emptyScreen: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    ...typography.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: '#2a1f24',
  },
  intro: {
    ...typography.body,
    color: '#6b5560',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
});
