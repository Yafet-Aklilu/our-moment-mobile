import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MomentPlayerBoundary } from '@/player/MomentPlayerBoundary';
import { isValidPublicToken } from '@/linking/momentUrl';
import { colors, typography } from '@/theme';

export default function PlayerScreen() {
  const { publicToken } = useLocalSearchParams<{ publicToken: string }>();
  const token = typeof publicToken === 'string' ? publicToken : '';

  if (!isValidPublicToken(token)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Invalid Moment link</Text>
      </View>
    );
  }

  return <MomentPlayerBoundary publicToken={token} />;
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
