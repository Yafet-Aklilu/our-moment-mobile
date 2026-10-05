import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MomentPlayerBoundary } from '@/player/MomentPlayerBoundary';
import { isValidPublicToken } from '@/linking/momentUrl';
import { colors, typography } from '@/theme';

/**
 * Root-level player route for Universal Links / App Links:
 *   https://ourmoment.app/m/{publicToken}
 * Maps into the same MomentPlayerBoundary as in-app navigation.
 */
export default function UniversalMomentScreen() {
  const { publicToken } = useLocalSearchParams<{ publicToken: string }>();
  const router = useRouter();
  const token = typeof publicToken === 'string' ? publicToken : '';

  if (!isValidPublicToken(token)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Invalid Moment link</Text>
      </View>
    );
  }

  return (
    <MomentPlayerBoundary
      publicToken={token}
      onClose={() => {
        if (router.canGoBack()) router.back();
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.moment.background,
    padding: 24,
  },
  title: { ...typography.titleSmall, color: colors.moment.text },
});
