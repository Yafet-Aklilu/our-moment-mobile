import { Link, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useMomentQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/theme';
import { MOMENT_STATE_LABEL } from '@/types/api';

export default function MomentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const query = useMomentQuery(momentId);

  if (query.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} />
      </View>
    );
  }

  if (!query.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.body}>Moment not found.</Text>
      </View>
    );
  }

  const moment = query.data;
  const isDraft = moment.state === 'draft';

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>{moment.receiver_name || 'Untitled moment'}</Text>
        <Text style={styles.meta}>
          {MOMENT_STATE_LABEL[moment.state]}
          {moment.template?.title ? ` · ${moment.template.title}` : ''}
        </Text>
        {moment.sender_name ? (
          <Text style={styles.meta}>From {moment.sender_name}</Text>
        ) : null}
      </Card>

      <View style={styles.actions}>
        {isDraft ? (
          <>
            <Link href={`/(app)/moments/${moment.id}/edit`} asChild>
              <Button label="Continue editing" />
            </Link>
            <Link href={`/(app)/moments/${moment.id}/preview`} asChild>
              <Button label="Preview" variant="secondary" />
            </Link>
            <Link href={`/(app)/moments/${moment.id}/activate`} asChild>
              <Button label="Activate" variant="secondary" />
            </Link>
          </>
        ) : (
          <>
            <Link href={`/(app)/moments/${moment.id}/share`} asChild>
              <Button label="Share" />
            </Link>
            {moment.public_token ? (
              <Link href={`/player/${moment.public_token}`} asChild>
                <Button label="Open Moment" variant="secondary" />
              </Link>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.light.background,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { gap: spacing.xs },
  title: { ...typography.title },
  meta: { ...typography.caption },
  body: { ...typography.body, color: colors.light.textSecondary },
  actions: { gap: spacing.sm },
});
