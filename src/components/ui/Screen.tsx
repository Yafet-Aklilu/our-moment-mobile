import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type Props = ViewProps & {
  title?: string;
};

export function Screen({ title, children, style, ...rest }: Props & { children: React.ReactNode }) {
  return (
    <View style={[styles.screen, style]} {...rest}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

export function Card({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[styles.card, shadows.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
});
