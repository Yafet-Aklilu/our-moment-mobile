import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({ label, hint, value, onChange, disabled }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={[styles.row, disabled && styles.disabled]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.label,
  },
  hint: {
    ...typography.caption,
  },
  track: {
    width: 52,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.light.borderStrong,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.brand.pink,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  disabled: {
    opacity: 0.5,
  },
});
