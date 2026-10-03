import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme';

type Props = {
  momentId: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
};

export function BuilderFooter({
  momentId,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  isLast,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.navRow}>
        <View style={styles.half}>
          <Button
            label="Previous"
            variant="secondary"
            disabled={!canGoPrev}
            onPress={onPrev}
          />
        </View>
        <View style={styles.half}>
          <Button
            label={isLast ? 'Review' : 'Next'}
            variant="soft"
            disabled={!canGoNext && !isLast}
            onPress={onNext}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label="Activate"
          onPress={() => router.push(`/(app)/moments/${momentId}/activate`)}
        />
      </View>
      <Text style={styles.hint}>
        Finish required steps before activating. The server decides credits and payment.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  actions: {
    width: '100%',
  },
  hint: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.light.textMuted,
  },
});
