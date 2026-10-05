import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <EmptyState
          icon="compass-outline"
          eyebrow="Lost the trail"
          title="This page isn’t here"
          body="That link doesn’t lead anywhere in OurMoment. Head home and keep creating."
          actionLabel="Go home"
          onAction={() => router.replace('/')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.light.background,
  },
});
