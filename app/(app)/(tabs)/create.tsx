import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiClientError } from '@/api/client';
import { momentsApi } from '@/api/resources/moments';
import { useTemplatesQuery } from '@/api/hooks/useMoments';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageIntro } from '@/components/ui/PageIntro';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TemplateGridCard } from '@/features/create/TemplateGridCard';
import { colors, spacing, typography } from '@/theme';
import type { TemplateSummary } from '@/types/api';

/**
 * Create = Choose a Style (web Templates/Select).
 * Two-column image grid; covers resolved via coverImageUrl (absolute asset host).
 */
export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const templates = useTemplatesQuery();
  const [startingId, setStartingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onStart = async (template: TemplateSummary) => {
    if (startingId != null) return;
    setError(null);
    setStartingId(template.id);
    try {
      const moment = await momentsApi.start(template.id);
      router.push(`/(app)/moments/${moment.id}/edit`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Couldn’t start this Moment. Please try again.');
      }
    } finally {
      setStartingId(null);
    }
  };

  if (templates.isLoading) {
    return <LoadingState label="Finding styles for you…" />;
  }

  if (templates.isError) {
    return (
      <ErrorState
        title="Couldn’t load styles"
        body="Check your connection and try again."
        onAction={() => void templates.refetch()}
      />
    );
  }

  const items = templates.data ?? [];

  return (
    <View style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 110,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageIntro
              eyebrow="Create"
              body="Choose who it’s for. Free to make — you pay only when you send."
              style={styles.intro}
            />
            {error ? <StatusBanner message={error} tone="error" /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="color-palette-outline"
            title="No styles right now"
            body="Styles will show up here when they’re available. Pull to refresh, or try again shortly."
          />
        }
        renderItem={({ item, index }) => (
          <TemplateGridCard
            template={item}
            index={index}
            disabled={startingId != null}
            onPress={() => void onStart(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {startingId != null ? (
        <View style={styles.startingOverlay} pointerEvents="none">
          <View style={styles.startingCard}>
            <ActivityIndicator color={colors.brand.pink} size="large" />
            <Text style={styles.startingText}>Starting your Moment…</Text>
            <Text style={styles.startingHint}>This only takes a moment.</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  intro: {
    marginBottom: 0,
  },
  row: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  startingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,247,242,0.82)',
    paddingHorizontal: spacing.xl,
  },
  startingCard: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    minWidth: 220,
  },
  startingText: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  startingHint: {
    ...typography.caption,
    textAlign: 'center',
  },
});
