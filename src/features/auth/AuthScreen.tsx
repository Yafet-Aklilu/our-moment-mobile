import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/BrandMark';
import { colors, motion, radii, shadows, spacing, typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  showBrand?: boolean;
  /** Shows a soft back control above the card. */
  showBack?: boolean;
};

/**
 * Auth chrome — mirrors redesigned web GuestLayout:
 * pink → yellow full-bleed wash + floating cream/white form card.
 */
export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
  contentStyle,
  showBrand = true,
  showBack = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.brand.pink, '#FF8A4C', colors.brand.yellow]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft decorative orbs — atmosphere, not noise */}
      <View pointerEvents="none" style={[styles.orb, styles.orbTop]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbBottom]} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xl,
            },
            contentStyle,
          ]}
        >
          {showBack && router.canGoBack() ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={styles.backChip}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={colors.light.text} />
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}

          <Animated.View
            entering={FadeInDown.duration(motion.duration.normal).springify()}
            style={[styles.card, shadows.soft]}
          >
            {showBrand ? (
              <View style={styles.brandRow}>
                <BrandMark size="sm" horizontal />
              </View>
            ) : null}

            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            <View style={styles.body}>{children}</View>
          </Animated.View>

          {footer ? (
            <View style={styles.footer}>
              <View style={styles.footerPill}>{footer}</View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  root: {
    flex: 1,
    backgroundColor: colors.brand.pink,
  },
  flex: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  orbTop: {
    top: -40,
    right: -60,
  },
  orbBottom: {
    bottom: 80,
    left: -80,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  backChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  backLabel: {
    ...typography.label,
    color: colors.light.text,
    marginRight: 4,
  },
  backSpacer: {
    height: spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  brandRow: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: '#2a1f24',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: '#6b5560',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  body: {
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  switchText: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  switchAction: {
    ...typography.bodyMedium,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_700Bold',
  },
});
