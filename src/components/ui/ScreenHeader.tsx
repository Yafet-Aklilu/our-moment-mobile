import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, touchMin, typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  /** When true, shows a back chevron that calls router.back(). */
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * In-content page header for screens that hide the stack bar,
 * or need a subtitle under a custom title.
 */
export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
  style,
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <View style={[styles.row, style]}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={handleBack}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.light.text} />
        </Pressable>
      ) : null}

      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : <View style={styles.rightSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchMin,
    marginBottom: spacing.md,
  },
  back: {
    width: touchMin,
    height: touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.xs,
  },
  textCol: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    ...typography.titleSmall,
  },
  subtitle: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  right: {
    marginLeft: spacing.xs,
  },
  rightSpacer: {
    width: spacing.xxs,
  },
});
