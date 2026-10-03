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
import { Button } from '@/components/ui/Button';
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
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (templates.isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn’t load styles</Text>
        <Text style={styles.errorBody}>
          Check your connection to the OurMoment API and try again.
        </Text>
        <Button
          label="Try again"
          variant="secondary"
          onPress={() => void templates.refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={templates.data ?? []}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 110,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.intro}>
              Choose who it’s for. Free to make — you pay only when you send.
            </Text>
            {error ? <Text style={styles.inlineError}>{error}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No styles available right now.</Text>
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
          <ActivityIndicator color={colors.brand.pink} />
          <Text style={styles.startingText}>Starting your Moment…</Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
  },
  header: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  intro: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  inlineError: {
    ...typography.caption,
    color: colors.light.danger,
  },
  row: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
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
  startingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,247,242,0.72)',
    gap: spacing.sm,
  },
  startingText: {
    ...typography.label,
    color: colors.light.textSecondary,
  },
});
