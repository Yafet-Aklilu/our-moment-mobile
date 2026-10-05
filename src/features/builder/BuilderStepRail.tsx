import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BuilderStep, BuilderStepId } from '@/features/builder/types';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  steps: BuilderStep[];
  activeId: BuilderStepId;
  onSelect: (id: BuilderStepId) => void;
};

export function BuilderStepRail({ steps, activeId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
    >
      {steps.map((step, index) => {
        const active = step.id === activeId;
        return (
          <Pressable
            key={step.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Step ${index + 1}: ${step.label}`}
            onPress={() => onSelect(step.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.index, active && styles.indexActive]}>{index + 1}</Text>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {step.label}
            </Text>
            {!step.implemented ? <View style={[styles.dot, active && styles.dotActive]} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.md,
    backgroundColor: 'transparent',
    maxWidth: 180,
  },
  chipActive: {
    backgroundColor: colors.brand.pinkSoft,
  },
  index: {
    ...typography.caption,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: colors.light.textMuted,
    minWidth: 14,
  },
  indexActive: {
    color: colors.brand.pinkDeep,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    fontFamily: 'Manrope_500Medium',
    color: colors.light.textSecondary,
    flexShrink: 1,
  },
  labelActive: {
    fontFamily: 'Manrope_600SemiBold',
    color: colors.light.text,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.light.borderStrong,
  },
  dotActive: {
    backgroundColor: colors.brand.yellow,
  },
});
