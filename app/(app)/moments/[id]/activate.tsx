import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { ApiClientError } from '@/api/client';
import { useMomentQuery } from '@/api/hooks/useMoments';
import { momentsApi } from '@/api/resources/moments';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageIntro } from '@/components/ui/PageIntro';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { Card } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/theme';

/**
 * Activation shell — server decides eligibility (credits / free publish / payment).
 * Gates Activate on preview `can_publish`. Payment UI stays out of scope.
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
  const creditsRemaining = status.data?.credits_remaining;

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
            'You’ll need a Moment credit or a successful payment before this can be sent. Payment in the app is coming soon — you can finish on the web for now.',
          );
        } else if (err.code === 'incomplete_moment') {
          setError('Finish the required steps before activating.');
          void preview.refetch();
        } else {
          setError(err.message);
        }
      } else {
        setError('Something went wrong. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isGateLoading && !momentQuery.data) {
    return <LoadingState label="Checking if this Moment is ready…" />;
  }

  return (
    <View style={styles.screen}>
      <PageIntro
        eyebrow="Activate"
        body="When you’re happy with the preview, activate to create a private share link. Create for free — pay (or use a credit) only when you’re ready to send."
        style={styles.intro}
      />

      {typeof creditsRemaining === 'number' ? (
        <Card muted style={styles.creditsCard}>
          <Text style={styles.creditsLabel}>Credits available</Text>
          <Text style={styles.creditsValue}>{creditsRemaining}</Text>
          <Text style={styles.creditsHint}>
            {creditsRemaining > 0
              ? 'You can use a credit to send this Moment.'
              : 'No credits left — you may need to finish sending on the web.'}
          </Text>
        </Card>
      ) : null}

      {alreadyActivated ? (
        <Card style={styles.statusCard}>
          <Text style={styles.statusEyebrow}>All set</Text>
          <Text style={styles.statusTitle}>Already sent</Text>
          <Text style={styles.statusBody}>
            This Moment is activated. Editing is locked — open Share to manage the private link.
          </Text>
          <Button
            label="Open share"
            variant="secondary"
            onPress={() => router.replace(`/(app)/moments/${momentId}/share`)}
          />
        </Card>
      ) : !canPublish ? (
        <Card muted style={styles.statusCard}>
          <Text style={styles.statusEyebrowNeeded}>Still needed</Text>
          <Text style={styles.statusTitle}>A few things left</Text>
          {missingSteps.length ? (
            missingSteps.map((step, index) => (
              <Text key={index} style={styles.missingItem}>
                • {missingStepLabel(step)}
              </Text>
            ))
          ) : (
            <Text style={styles.missingItem}>Finish the required steps in the builder first.</Text>
          )}
          <Button
            label="Continue editing"
            variant="secondary"
            onPress={() => router.push(`/(app)/moments/${momentId}/edit`)}
            style={styles.statusAction}
          />
        </Card>
      ) : (
        <Card style={styles.statusCard}>
          <Text style={styles.statusEyebrow}>Ready</Text>
          <Text style={styles.statusTitle}>Ready to send</Text>
          <Text style={styles.statusBody}>
            Everything required is in place. Activate to generate the private link.
          </Text>
        </Card>
      )}

      {error ? <StatusBanner message={error} tone="error" /> : null}

      {!alreadyActivated ? (
        <Button
          label="Activate Moment"
          onPress={() => void onActivate()}
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
  intro: {
    marginBottom: 0,
  },
  creditsCard: {
    gap: 2,
  },
  creditsLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  creditsValue: {
    ...typography.title,
  },
  creditsHint: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  statusCard: {
    gap: spacing.xs,
  },
  statusEyebrow: {
    ...typography.caption,
    color: colors.light.success,
    fontFamily: 'Manrope_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontSize: 11,
  },
  statusEyebrowNeeded: {
    ...typography.caption,
    color: colors.status.draftText,
    fontFamily: 'Manrope_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontSize: 11,
  },
  statusTitle: {
    ...typography.subtitle,
  },
  statusBody: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  missingItem: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  statusAction: {
    marginTop: spacing.sm,
  },
});
