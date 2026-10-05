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
        <View style={styles.prevSlot}>
          <Button
            label="Previous"
            variant="ghost"
            disabled={!canGoPrev}
            onPress={onPrev}
          />
        </View>
        <View style={styles.nextSlot}>
          <Button
            label={isLast ? 'Review' : 'Next'}
            variant="primary"
            disabled={!canGoNext && !isLast}
            onPress={onNext}
          />
        </View>
      </View>

      <Button
        label="Activate"
        variant="soft"
        onPress={() => router.push(`/(app)/moments/${momentId}/activate`)}
        style={styles.activate}
      />

      <Text style={styles.hint}>
        When you’re ready, activate to share. Credits and payment are handled next.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surfaceWarm,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prevSlot: {
    flexShrink: 0,
  },
  nextSlot: {
    flex: 1,
  },
  activate: {
    width: '100%',
  },
  hint: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.light.textMuted,
    paddingBottom: spacing.xs,
  },
});
