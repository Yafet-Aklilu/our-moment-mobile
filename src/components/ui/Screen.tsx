import { StyleSheet, Text, View, ViewProps } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
};

/**
 * Warm app shell — cream foundation + optional page title.
 * Prefer feature layouts for complex screens; use Screen for simple stacks.
 */
export function Screen({
  title,
  subtitle,
  children,
  style,
  ...rest
}: Props & { children: React.ReactNode }) {
  return (
    <View style={[styles.screen, style]} {...rest}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

type CardProps = ViewProps & {
  children: React.ReactNode;
  /** Softer muted fill instead of white surface */
  muted?: boolean;
  /** Drop the border for quieter grouping */
  borderless?: boolean;
};

/** Soft rounded surface for interactive or grouped content. */
export function Card({ children, style, muted, borderless, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        shadows.card,
        muted && styles.cardMuted,
        borderless && styles.cardBorderless,
        style,
      ]}
      {...rest}
    >
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardMuted: {
    backgroundColor: colors.light.surfaceMuted,
  },
  cardBorderless: {
    borderWidth: 0,
  },
});
