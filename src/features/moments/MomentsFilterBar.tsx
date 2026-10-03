import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import type { MomentState } from '@/types/api';

export type MomentsFilter = 'all' | MomentState;

type Chip = { key: MomentsFilter; label: string };

const CHIPS: Chip[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Still editing' },
  { key: 'activated', label: 'Sent' },
];

type Props = {
  value: MomentsFilter;
  onChange: (next: MomentsFilter) => void;
  totalLabel?: string;
};

/** Mirrors web Moments Index filters: All / Still editing / Sent. */
export function MomentsFilterBar({ value, onChange, totalLabel }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.chips}>
        {CHIPS.map((chip) => {
          const active = value === chip.key;
          return (
            <Pressable
              key={chip.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(chip.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {totalLabel ? <Text style={styles.count}>{totalLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.brand.charcoal,
    borderColor: colors.brand.charcoal,
  },
  chipText: {
    ...typography.label,
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
  },
  count: {
    ...typography.caption,
  },
});
