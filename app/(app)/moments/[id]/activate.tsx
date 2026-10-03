import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { ApiClientError } from '@/api/client';
import { useMomentQuery } from '@/api/hooks/useMoments';
import { momentsApi } from '@/api/resources/moments';
import { Button } from '@/components/ui/Button';
import { colors, radii, spacing, typography } from '@/theme';

/**
 * Activation shell — server decides eligibility (credits / free publish / payment).
 * Gates the Activate button on `GET /preview`'s `can_publish`, mirroring the
 * web editor's publish blockers. Payment UI is intentionally not built here.
 */
export default function MomentActivateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const momentQuery = useMomentQuery(momentId);

  const status = useQuery({
    queryKey: ['moments', momentId, 'activation-status'],
    queryFn: () => momentsApi.activationStatus(momentId),
    enabled: Number.isFinite(momentId),
  });

  const preview = useQuery({
    queryKey: ['moments', momentId, 'preview'],
    queryFn: () => momentsApi.preview(momentId),
    enabled: Number.isFinite(momentId),
  });

  const isGateLoading = momentQuery.isLoading || preview.isLoading;
  const alreadyActivated = momentQuery.data?.state === 'activated';
  const canPublish = preview.data?.can_publish === true;
  const missingSteps = preview.data?.missing_steps ?? [];

  const onActivate = async () => {
    if (alreadyActivated || !canPublish) return;
    setError(null);
    setLoading(true);
    try {
      await momentsApi.activate(momentId);
      router.replace(`/(app)/moments/${momentId}/share`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.code === 'payment_required' || err.code === 'insufficient_credits') {
          setError(
            'A successful payment is required before activation. Payment UI ships in a later phase.',
          );
        } else if (err.code === 'incomplete_moment') {
          setError('Finish the required steps before activating.');
          void preview.refetch();
        } else {
          setError(err.message);
        }
      } else {
        setError('Activation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Activate</Text>
      <Text style={styles.body}>
        Pay & send when you’re ready. The API decides whether this moment can be
        activated with credits, free publish, or payment.
      </Text>
      {status.data ? (
        <Text style={styles.meta}>
          state={status.data.state} · credits={status.data.credits_remaining}
        </Text>
      ) : null}

      {alreadyActivated ? (
        <View style={styles.missingCard}>
          <Text style={styles.missingTitle}>Already sent</Text>
          <Text style={styles.missingItem}>
            This Moment is activated. Editing is locked — open Share to manage the link.
          </Text>
          <Button
            label="Open share"
            variant="secondary"
            onPress={() => router.replace(`/(app)/moments/${momentId}/share`)}
          />
        </View>
      ) : isGateLoading ? (
        <ActivityIndicator color={colors.brand.pink} />
      ) : !canPublish ? (
        <View style={styles.missingCard}>
          <Text style={styles.missingTitle}>Still needed</Text>
          {missingSteps.length ? (
            missingSteps.map((step, index) => (
              <Text key={index} style={styles.missingItem}>
                • {missingStepLabel(step)}
              </Text>
            ))
          ) : (
            <Text style={styles.missingItem}>Finish the required steps in the builder first.</Text>
          )}
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!alreadyActivated ? (
        <Button
          label="Activate"
          onPress={onActivate}
          loading={loading}
          disabled={!canPublish || isGateLoading}
        />
      ) : null}
    </View>
  );
}

/** `missing_steps` entries are `{id,type,label,reason}` objects on the wire; tolerate either shape. */
function missingStepLabel(step: unknown): string {
  if (step && typeof step === 'object') {
    const obj = step as { label?: unknown; id?: unknown };
    if (typeof obj.label === 'string' && obj.label) return obj.label;
    if (typeof obj.id === 'string' && obj.id) return obj.id;
  }
  return String(step);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.light.background,
  },
  title: { ...typography.title },
  body: { ...typography.body, color: colors.light.textSecondary },
  meta: { ...typography.caption },
  missingCard: {
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 2,
  },
  missingTitle: {
    ...typography.label,
    color: colors.light.text,
    marginBottom: spacing.xxs,
  },
  missingItem: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  error: { ...typography.caption, color: colors.light.danger },
});
