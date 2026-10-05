import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMomentsQuery } from '@/api/hooks/useMoments';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { MomentListCard } from '@/features/moments/MomentListCard';
import {
  MomentsFilterBar,
  type MomentsFilter,
} from '@/features/moments/MomentsFilterBar';
import { MomentsEmptyState } from '@/features/moments/MomentsEmptyState';
import { colors, spacing, typography } from '@/theme';
import type { MomentState } from '@/types/api';

/**
 * My Moments — experiences, not database records.
 * Runtime: MomentsFilterBar + MomentListCard + MomentsEmptyState.
 * Filters: All / Editing / Sent via API `?state=`.
 */
export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<MomentsFilter>('all');
  const stateParam: MomentState | undefined =
    filter === 'all' ? undefined : filter;

  const moments = useMomentsQuery(stateParam);
  const items = moments.data?.data ?? [];
  const total =
    (moments.data?.meta?.total as number | undefined) ?? items.length;

  const filterLabel = useMemo(() => {
    if (filter === 'draft') return 'Still editing';
    if (filter === 'activated') return 'Sent';
    return 'All';
  }, [filter]);

  const countLabel =
    total === 1 ? '1 Moment' : `${total} Moments`;

  if (moments.isLoading && !moments.data) {
    return <LoadingState label="Loading your Moments…" />;
  }

  if (moments.isError && !moments.data) {
    return (
      <ErrorState
        title="Couldn’t load your Moments"
        body="Check your connection and try again."
        onAction={() => void moments.refetch()}
      />
    );
  }

  const isEmpty = items.length === 0;
  const isFilteredEmpty = isEmpty && filter !== 'all';
  const isTrulyEmpty = isEmpty && filter === 'all';

  return (
    <View style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + 110,
          },
          isEmpty ? styles.listEmpty : null,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={moments.isFetching && !moments.isLoading}
            onRefresh={() => void moments.refetch()}
            tintColor={colors.brand.pink}
            colors={[colors.brand.pink]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Library</Text>
            <Text style={styles.title}>Your Moments</Text>
            <Text style={styles.intro}>
              Drafts you’re shaping and Moments you’ve already sent — gathered with care.
            </Text>
            <MomentsFilterBar
              value={filter}
              onChange={setFilter}
              totalLabel={!isTrulyEmpty ? countLabel : undefined}
            />
          </View>
        }
        ListEmptyComponent={
          <MomentsEmptyState
            filtered={isFilteredEmpty}
            filterLabel={filterLabel}
            onClearFilter={() => setFilter('all')}
          />
        }
        renderItem={({ item, index }) => (
          <MomentListCard moment={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
    marginBottom: spacing.xs,
  },
  sep: {
    height: spacing.md,
  },
});
