import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useUpdateMomentSettingsMutation } from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings } from '@/features/builder/contentHelpers';
import { PLAYBACK_SCENE_OPTIONS } from '@/features/builder/experienceOptions';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { colors, radii, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

const SCENE_LABELS: Map<string, string> = new Map(PLAYBACK_SCENE_OPTIONS.map((o) => [o.id, o.label]));
const DEFAULT_ORDER = PLAYBACK_SCENE_OPTIONS.map((o) => o.id);

function buildOrder(settings: Record<string, unknown>): string[] {
  const playback =
    settings.playback && typeof settings.playback === 'object' ? (settings.playback as Record<string, unknown>) : {};
  const stored = Array.isArray(playback.sceneOrder)
    ? (playback.sceneOrder as unknown[])
        .map((entry) => (entry && typeof entry === 'object' ? (entry as { id?: unknown }).id : null))
        .filter((id): id is string => typeof id === 'string' && SCENE_LABELS.has(id))
    : [];

  const withoutCta = stored.filter((id) => id !== 'cta');
  const missing = DEFAULT_ORDER.filter((id) => id !== 'cta' && !withoutCta.includes(id));
  const reorderable = [...withoutCta, ...missing];

  return SCENE_LABELS.has('cta') ? [...reorderable, 'cta'] : reorderable;
}

/** Experience: Order (playback scene sequence). CTA always stays last. */
export function OrderStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentSettingsMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const order = buildOrder(settings);

  const persist = (next: string[]) => {
    void run(async () => {
      await mutation.mutateAsync({
        ...settings,
        playback: { sceneOrder: next.map((id) => ({ id, occurrence: 0 })) },
      });
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    if (readOnly) return;
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    if (order[index] === 'cta' || order[target] === 'cta') return;
    const next = [...order];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    persist(next);
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title="Order"
        body="Change the order things play in."
        style={styles.intro}
      />

      <View style={styles.list}>
        {order.map((id, index) => {
          const isCta = id === 'cta';
          const isFirst = index === 0;
          const isLastReorderable = order[index + 1] === 'cta' || index === order.length - 1;
          return (
            <View key={`${id}-${index}`} style={styles.row}>
              <Text style={styles.rowIndex}>{index + 1}</Text>
              <Text style={styles.rowLabel}>{SCENE_LABELS.get(id) ?? id}</Text>
              {isCta ? (
                <Text style={styles.pinnedLabel}>Always last</Text>
              ) : (
                <View style={styles.rowActions}>
                  <Pressable
                    onPress={() => move(index, -1)}
                    disabled={readOnly || isFirst}
                    style={[styles.moveButton, (readOnly || isFirst) && styles.moveButtonDisabled]}
                  >
                    <Ionicons name="chevron-up" size={18} color={colors.light.text} />
                  </Pressable>
                  <Pressable
                    onPress={() => move(index, 1)}
                    disabled={readOnly || isLastReorderable}
                    style={[styles.moveButton, (readOnly || isLastReorderable) && styles.moveButtonDisabled]}
                  >
                    <Ionicons name="chevron-down" size={18} color={colors.light.text} />
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <BuilderSaveStatus status={status} errorMessage={errorMessage} readOnly={readOnly} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.lg,
  },
  intro: {
    marginBottom: 0,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  rowIndex: {
    ...typography.caption,
    fontSize: 12,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
    width: 20,
  },
  rowLabel: {
    ...typography.label,
    flex: 1,
    color: colors.light.text,
  },
  pinnedLabel: {
    ...typography.caption,
    fontSize: 12,
    color: colors.light.textMuted,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 4,
  },
  moveButton: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surfaceMuted,
  },
  moveButtonDisabled: {
    opacity: 0.35,
  },
});
