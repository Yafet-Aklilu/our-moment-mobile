import { StyleSheet, Text, View } from 'react-native';

import { usePublicMomentQuery } from '@/api/hooks/useMoments';
import { LoadingState } from '@/components/ui/LoadingState';
import { asMomentConfig, isMomentConfigEmpty } from '@/player/momentConfig';
import { NativeMomentPlayer } from '@/player/NativeMomentPlayer';
import { colors, typography } from '@/theme';

import { resolvePlayerMode } from './types';
import { WebViewFallbackPlayer } from './WebViewFallback';

type Props = {
  publicToken: string;
  onClose?: () => void;
};

/**
 * Stable boundary used by deep links, QR scan, and in-app open.
 *
 * Public playback defaults to WebView for full web parity (audio,
 * remote lock verify, reactions). When `NATIVE_PLAYER_READY` is true and
 * the public config is playable, we use the same NativeMomentPlayer as
 * owner preview — without changing routes or share URLs.
 */
export function MomentPlayerBoundary({ publicToken, onClose }: Props) {
  const mode = resolvePlayerMode();
  const query = usePublicMomentQuery(publicToken);

  if (query.isLoading) {
    return (
      <LoadingState style={{ backgroundColor: colors.moment.background }} />
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

  if (mode === 'native') {
    const config = asMomentConfig(query.data.config);
    if (config && !isMomentConfigEmpty(config)) {
      return (
        <NativeMomentPlayer
          config={config}
          onClose={onClose ?? (() => undefined)}
        />
      );
    }
    // Fall through to WebView if native config is empty/unusable.
  }

  return <WebViewFallbackPlayer publicToken={publicToken} />;
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
