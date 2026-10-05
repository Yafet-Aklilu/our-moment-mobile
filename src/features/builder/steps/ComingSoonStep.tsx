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
      <Text style={styles.kicker}>Coming soon</Text>
      <Text style={styles.title}>{step.label}</Text>
      {step.description ? <Text style={styles.body}>{step.description}</Text> : null}
      <View style={styles.note}>
        <Text style={styles.noteText}>
          This part is coming soon. You can keep editing the rest of your Moment — we’ll fill this in next.
        </Text>
      </View>
      {step.required ? (
        <Text style={styles.required}>Needed before you activate</Text>
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
    fontSize: 12,
    letterSpacing: 0.4,
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
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.light.surfaceMuted,
  },
  noteText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.textSecondary,
  },
  required: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_500Medium',
    marginTop: spacing.xs,
  },
  optional: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
