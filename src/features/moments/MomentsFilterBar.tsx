import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import type { MomentState } from '@/types/api';

export type MomentsFilter = 'all' | MomentState;

type Chip = { key: MomentsFilter; label: string };

const CHIPS: Chip[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Editing' },
  { key: 'activated', label: 'Sent' },
];

type Props = {
  value: MomentsFilter;
  onChange: (next: MomentsFilter) => void;
  totalLabel?: string;
};

/** Soft filter segments — useful, not SaaS chip clutter. */
export function MomentsFilterBar({ value, onChange, totalLabel }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {CHIPS.map((chip) => {
          const active = value === chip.key;
          return (
            <Pressable
              key={chip.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(chip.key)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
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
  track: {
    flexDirection: 'row',
    backgroundColor: colors.light.surfaceMuted,
    borderRadius: radii.pill,
    padding: 4,
    gap: 2,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.brand.charcoal,
  },
  segmentText: {
    ...typography.label,
    fontSize: 13,
    color: colors.light.textMuted,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  count: {
    ...typography.caption,
    color: '#6b5560',
    textAlign: 'center',
  },
});
