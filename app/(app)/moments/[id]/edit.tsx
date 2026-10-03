import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useMomentQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { BuilderShell } from '@/features/builder/BuilderShell';
import { colors, spacing, typography } from '@/theme';

/**
 * Native Moment Builder entry — replaces the editor foundation placeholder.
 * Shell + Details (names) are live; remaining steps land in follow-up passes.
 */
export default function MomentEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const query = useMomentQuery(momentId);

  if (!Number.isFinite(momentId) || momentId <= 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Invalid Moment</Text>
      </View>
    );
  }

  if (query.isLoading && !query.data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (query.isError && !query.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn’t load this Moment</Text>
        <Text style={styles.errorBody}>Check your connection and try again.</Text>
        <Button label="Try again" variant="secondary" onPress={() => void query.refetch()} />
      </View>
    );
  }

  if (!query.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Moment not found</Text>
      </View>
    );
  }

  return <BuilderShell moment={query.data} />;
}

const styles = StyleSheet.create({
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
  },
});
