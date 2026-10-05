import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Section header with optional “See all” style action. */
export function SectionLabel({ title, subtitle, actionLabel, onAction, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable hitSlop={8} onPress={onAction} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  textCol: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    ...typography.subtitle,
  },
  subtitle: {
    ...typography.caption,
  },
  action: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    marginBottom: 1,
  },
});
