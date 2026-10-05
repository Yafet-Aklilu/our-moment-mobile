import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/Button';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared empty chrome — warm, human, with optional soft icon wash.
 */
export function EmptyState({
  eyebrow,
  title,
  body,
  icon = 'heart',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  style,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[colors.brand.pink, colors.brand.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWash}
      >
        <Ionicons name={icon} size={28} color="#fff" />
      </LinearGradient>
      {eyebrow ? (
        <View style={styles.eyebrowWrap}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Button label={secondaryLabel} variant="ghost" onPress={onSecondary} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  iconWash: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  eyebrowWrap: {
    backgroundColor: colors.light.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
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
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  action: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
    maxWidth: 280,
  },
});
