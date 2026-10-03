import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Option = { id: string; label: string };

type Props = {
  options: readonly Option[] | Option[];
  value: string | null | undefined;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export function ChoiceChips({ options, value, onChange, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            disabled={disabled}
            onPress={() => onChange(opt.id)}
            style={[styles.chip, active && styles.chipActive, disabled && styles.disabled]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  chipActive: {
    backgroundColor: colors.brand.charcoal,
    borderColor: colors.brand.charcoal,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    color: colors.light.text,
  },
  labelActive: {
    color: colors.brand.soft,
  },
  disabled: {
    opacity: 0.5,
  },
});
