import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { usePublicMomentQuery } from '@/api/hooks/useMoments';
import { colors, typography } from '@/theme';

import { resolvePlayerMode } from './types';
import { WebViewFallbackPlayer } from './WebViewFallback';

type Props = {
  publicToken: string;
};

/**
 * Stable boundary used by deep links, QR scan, and in-app open.
 * Native player slots in here later without route changes.
 */
export function MomentPlayerBoundary({ publicToken }: Props) {
  const mode = resolvePlayerMode();
  const query = usePublicMomentQuery(publicToken);

  if (query.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (query.isError || !query.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>This moment isn’t available</Text>
        <Text style={styles.body}>
          The link may have been revoked or hasn’t been activated yet.
        </Text>
      </View>
    );
  }

  if (mode === 'webview-fallback') {
    return <WebViewFallbackPlayer publicToken={publicToken} />;
  }

  // Native player placeholder — config already fetched for future scenes.
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Native Moment Player</Text>
      <Text style={styles.body}>
        Scene player coming soon. Config loaded for moment #{query.data.moment_id}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.moment.background,
  },
  title: {
    ...typography.titleSmall,
    color: colors.moment.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    ...typography.body,
    color: colors.moment.textMuted,
    textAlign: 'center',
  },
});
