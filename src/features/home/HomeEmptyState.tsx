import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, radii, spacing, typography } from '@/theme';

export function HomeEmptyState() {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Your moments</Text>
      <Text style={styles.title}>Nothing here yet</Text>
      <Text style={styles.body}>
        Choose a style, add your words and photos, then activate and share a private
        link they’ll love.
      </Text>
      <Link href="/(app)/(tabs)/create" asChild>
        <Button label="Create a moment" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surfaceWarm,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  title: {
    ...typography.titleSmall,
  },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginBottom: spacing.sm,
  },
});
