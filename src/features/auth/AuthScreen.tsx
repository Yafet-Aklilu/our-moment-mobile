import { Link } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/BrandMark';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  showBrand?: boolean;
};

/**
 * Shared auth form chrome — reference structure (brand → headline → form → footer)
 * with OurMoment warm surfaces and typography.
 */
export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
  contentStyle,
  showBrand = true,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xl,
          },
          contentStyle,
        ]}
      >
        {showBrand ? (
          <View style={styles.brandRow}>
            <BrandMark size="sm" />
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.body}>{children}</View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type SwitchLinkProps = {
  prompt: string;
  actionLabel: string;
  href: '/(auth)/login' | '/(auth)/register' | '/(auth)/welcome' | '/(auth)/forgot-password';
};

export function AuthSwitchLink({ prompt, actionLabel, href }: SwitchLinkProps) {
  return (
    <Text style={styles.switchText}>
      {prompt}{' '}
      <Link href={href} style={styles.switchAction}>
        {actionLabel}
      </Link>
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  brandRow: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.display,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginBottom: spacing.xl,
  },
  body: {
    gap: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  switchText: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  switchAction: {
    ...typography.bodyMedium,
    color: colors.brand.pinkDeep,
    textDecorationLine: 'underline',
  },
});
