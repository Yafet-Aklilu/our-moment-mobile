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
            {!step.implemented ? <View style={styles.dot} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    maxWidth: 200,
  },
  chipActive: {
    backgroundColor: colors.brand.charcoal,
    borderColor: colors.brand.charcoal,
  },
  index: {
    ...typography.caption,
    fontFamily: 'Manrope_700Bold',
    color: colors.brand.pinkDeep,
    minWidth: 16,
  },
  indexActive: {
    color: colors.brand.yellow,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    color: colors.light.text,
    flexShrink: 1,
  },
  labelActive: {
    color: colors.brand.soft,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.borderStrong,
  },
});
