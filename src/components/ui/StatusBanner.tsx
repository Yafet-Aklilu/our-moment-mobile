import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Tone = 'success' | 'info' | 'warning' | 'error';

type Props = {
  message: string;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
};

const TONE = {
  success: {
    bg: 'rgba(47, 158, 107, 0.12)',
    fg: colors.light.success,
    icon: 'checkmark-circle' as const,
  },
  info: {
    bg: colors.brand.pinkSoft,
    fg: colors.brand.pinkDeep,
    icon: 'heart' as const,
  },
  warning: {
    bg: colors.status.draftBg,
    fg: colors.status.draftText,
    icon: 'sparkles' as const,
  },
  error: {
    bg: 'rgba(170, 55, 28, 0.1)',
    fg: colors.light.danger,
    icon: 'alert-circle' as const,
  },
};

/** Soft status / success / error banner for forms and lifecycle screens. */
export function StatusBanner({ message, tone = 'info', style }: Props) {
  const t = TONE[tone];
  return (
    <View style={[styles.banner, { backgroundColor: t.bg }, style]}>
      <Ionicons name={t.icon} size={18} color={t.fg} />
      <Text style={[styles.text, { color: t.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  text: {
    ...typography.bodyMedium,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
