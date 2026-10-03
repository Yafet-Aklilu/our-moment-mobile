import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Row =
  | {
      key: string;
      label: string;
      hint?: string;
      icon: keyof typeof Ionicons.glyphMap;
      href: Href;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      icon: keyof typeof Ionicons.glyphMap;
      onPress: () => void;
    };

type Props = {
  rows: Row[];
};

export function AccountSettingsList({ rows }: Props) {
  return (
    <View style={styles.card}>
      {rows.map((row, index) => {
        const content = (
          <View
            style={[
              styles.row,
              index < rows.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.icon}>
              <Ionicons name={row.icon} size={20} color={colors.brand.pinkDeep} />
            </View>
            <View style={styles.text}>
              <Text style={styles.label}>{row.label}</Text>
              {row.hint ? <Text style={styles.hint}>{row.hint}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textMuted} />
          </View>
        );

        if ('href' in row) {
          return (
            <Link key={row.key} href={row.href} asChild>
              <Pressable>{content}</Pressable>
            </Link>
          );
        }

        return (
          <Pressable key={row.key} onPress={row.onPress}>
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.subtitle,
    fontSize: 15,
  },
  hint: {
    ...typography.caption,
  },
});
