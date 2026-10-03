/**
 * Shared composition shell for Moment scenes — native port of
 * `our-moment-web/resources/js/Components/moment/MomentSceneFrame.vue`.
 * Keeps spacing, safe-area, and typography rhythm consistent across scenes.
 */
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fontFamilies, spacing } from '@/theme';

type Align = 'center' | 'bottom' | 'top';

type Props = {
  eyebrow?: string;
  hint?: string;
  align?: Align;
  /** Full-bleed media scenes — no padding, stretch children. */
  fill?: boolean;
  /** Constrain reading width for long-form text. */
  narrow?: boolean;
  textColor: string;
  mutedColor: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SceneFrame({
  eyebrow,
  hint,
  align = 'center',
  fill = false,
  narrow = true,
  textColor,
  mutedColor,
  children,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  if (fill) {
    return <View style={[styles.fill, style]}>{children}</View>;
  }

  return (
    <View
      style={[
        styles.root,
        alignStyles[align],
        {
          paddingTop: Math.max(spacing.xxl, insets.top + spacing.xl),
          paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.lg),
        },
        style,
      ]}
    >
      <View style={[styles.inner, narrow ? styles.narrow : null]}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: mutedColor }]}>{eyebrow}</Text> : null}
        {children}
        {hint ? <Text style={[styles.hint, { color: mutedColor }]}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const alignStyles: Record<Align, ViewStyle> = {
  center: { alignItems: 'center', justifyContent: 'center' },
  bottom: { alignItems: 'center', justifyContent: 'flex-end' },
  top: { alignItems: 'center', justifyContent: 'flex-start' },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  fill: {
    flex: 1,
    width: '100%',
  },
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  narrow: {
    maxWidth: 420,
  },
  eyebrow: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  hint: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    opacity: 0.85,
    textAlign: 'center',
  },
});
