import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type Props = {
  title: string;
  meta?: string;
  trailing?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Soft list row for inboxes, settings-adjacent lists, share actions. */
export function ListRow({ title, meta, trailing, icon, onPress, style }: Props) {
  const content = (
    <View style={[styles.row, shadows.card, style]}>
      {icon ? (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color={colors.brand.pinkDeep} />
        </View>
      ) : null}
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.light.textMuted} />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.brand.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    ...typography.subtitle,
    fontSize: 16,
  },
  meta: {
    ...typography.caption,
  },
  trailing: {
    ...typography.label,
    fontSize: 12,
    color: colors.brand.pinkDeep,
  },
});
