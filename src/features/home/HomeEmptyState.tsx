import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { EmptyState } from '@/components/ui/EmptyState';
import { colors, radii, spacing } from '@/theme';

export function HomeEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[colors.brand.soft, colors.light.surfaceWarm, '#FFFFFF']}
        style={styles.wash}
      >
        <EmptyState
          eyebrow="Your Moments"
          icon="heart"
          title="Your space is waiting"
          body="Choose a style, add your words and photos, then send a private Moment they’ll open — and keep."
          actionLabel="Create a Moment"
          onAction={() => router.push('/(app)/(tabs)/create')}
          style={styles.empty}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  wash: {
    paddingVertical: spacing.md,
  },
  empty: {
    paddingVertical: spacing.xl,
  },
});
