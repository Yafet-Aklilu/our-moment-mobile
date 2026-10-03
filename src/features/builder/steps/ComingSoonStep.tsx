import { StyleSheet, Text, View } from 'react-native';

import type { BuilderStep } from '@/features/builder/types';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  step: BuilderStep;
};

/** Placeholder for builder steps not yet implemented in this pass. */
export function ComingSoonStep({ step }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>Coming next</Text>
      <Text style={styles.title}>{step.label}</Text>
      <Text style={styles.body}>{step.description}</Text>
      <View style={styles.note}>
        <Text style={styles.noteText}>
          This section will use the same /api/v1/moments contracts as the web
          builder. Details (names) is live in this pass.
        </Text>
      </View>
      {step.required ? (
        <Text style={styles.required}>Required before activate</Text>
      ) : (
        <Text style={styles.optional}>Optional</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  title: {
    ...typography.titleSmall,
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  note: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  noteText: {
    ...typography.caption,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
  required: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    marginTop: spacing.xs,
  },
  optional: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
