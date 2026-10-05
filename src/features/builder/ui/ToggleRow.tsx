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
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
  },
  track: {
    width: 48,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.light.surfaceContainer,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.brand.pink,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  disabled: {
    opacity: 0.5,
  },
});
