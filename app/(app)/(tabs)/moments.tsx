import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMomentsQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { MomentListCard } from '@/features/moments/MomentListCard';
import {
  MomentsFilterBar,
  type MomentsFilter,
} from '@/features/moments/MomentsFilterBar';
import { MomentsEmptyState } from '@/features/moments/MomentsEmptyState';
import { colors, spacing, typography } from '@/theme';
import type { MomentState } from '@/types/api';

/**
 * My Moments — drafts, sent moments, and replies.
 * Filters mirror web: All / Still editing / Sent via API `?state=`.
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
    total === 1 ? '1 moment' : `${total} moments`;

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
        <Text style={styles.errorTitle}>Couldn’t load your Moments</Text>
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
            <Text style={styles.subtitle}>
              Drafts, sent Moments, and any replies.
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
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  sep: {
    height: spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
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
