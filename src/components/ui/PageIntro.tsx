import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  eyebrow?: string;
  title?: string;
  body: string;
  style?: StyleProp<ViewStyle>;
};

/** Short page lead — one purpose, warm and human. */
export function PageIntro({ eyebrow, title, body, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    ...typography.titleSmall,
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
});
