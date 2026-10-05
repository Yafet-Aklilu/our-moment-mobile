import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Centered recover-friendly error surface. */
export function ErrorState({
  title,
  body,
  actionLabel = 'Try again',
  onAction,
  style,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
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
