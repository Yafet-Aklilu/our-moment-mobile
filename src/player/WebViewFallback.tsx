import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';

import { webPlayerUrl } from './types';

type Props = {
  publicToken: string;
};

/**
 * Temporary parity surface — loads the finished web Moment player.
 * Replace via MomentPlayerBoundary without changing routes or URLs.
 */
export function WebViewFallbackPlayer({ publicToken }: Props) {
  return (
    <View style={styles.root}>
      <WebView
        source={{ uri: webPlayerUrl(publicToken) }}
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.brand.pink} size="large" />
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.moment.background },
  webview: { flex: 1, backgroundColor: 'transparent' },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.moment.background,
  },
});
