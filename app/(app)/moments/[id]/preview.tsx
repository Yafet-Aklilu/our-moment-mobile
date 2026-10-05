import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { momentsApi } from '@/api/resources/moments';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { NativeMomentPlayer } from '@/player/NativeMomentPlayer';
import { asMomentConfig, isMomentConfigEmpty } from '@/player/momentConfig';
import { colors, spacing } from '@/theme';

/**
 * Owner Preview — renders the native Moment Player against
 * `GET /api/v1/moments/{id}/preview`. This never activates/publishes; it's
 * a read-only rehearsal of what the recipient will eventually see.
 */
export default function MomentPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const momentId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const preview = useQuery({
    queryKey: ['moments', momentId, 'preview'],
    queryFn: () => momentsApi.preview(momentId),
    enabled: Number.isFinite(momentId),
  });

  const handleClose = () => router.back();

  // Block Android hardware back + edge swipe (gesture disabled in stack options)
  // so horizontal lock/gallery gestures aren't stolen by navigation.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  if (preview.isLoading) {
    return <LoadingState label="Preparing your preview…" />;
  }

  if (preview.isError || !preview.data) {
    return (
      <View style={styles.chrome}>
        <BackButton onPress={handleClose} insetsTop={insets.top} />
        <ErrorState
          title="Preview unavailable"
          body="We couldn’t load this moment’s preview. Try again shortly."
          actionLabel="Close"
          onAction={handleClose}
          style={styles.chromeState}
        />
      </View>
    );
  }

  const config = asMomentConfig(preview.data.config);

  if (!config || isMomentConfigEmpty(config)) {
    const missing = preview.data.missing_steps ?? [];
    const missingBody =
      missing.length > 0
        ? `Still needed: ${missing.map(missingStepLabel).join(', ')}.`
        : 'Add a message, photo, or the other moment details first — your preview will come alive once there’s something to show.';

    return (
      <View style={styles.chrome}>
        <BackButton onPress={handleClose} insetsTop={insets.top} />
        <EmptyState
          eyebrow="Preview"
          icon="eye-outline"
          title="Nothing to preview yet"
          body={missingBody}
          actionLabel="Continue editing"
          onAction={() => router.replace(`/(app)/moments/${momentId}/edit`)}
          secondaryLabel="Close"
          onSecondary={handleClose}
          style={styles.chromeState}
        />
      </View>
    );
  }

  return <NativeMomentPlayer config={config} onClose={handleClose} />;
}

function missingStepLabel(step: unknown): string {
  if (step && typeof step === 'object') {
    const obj = step as { label?: unknown; id?: unknown };
    if (typeof obj.label === 'string' && obj.label) return obj.label;
    if (typeof obj.id === 'string' && obj.id) return obj.id;
  }
  return String(step);
}

function BackButton({ onPress, insetsTop }: { onPress: () => void; insetsTop: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close preview"
      onPress={onPress}
      style={[styles.backButton, { top: insetsTop + spacing.sm }]}
    >
      <Ionicons name="close" size={20} color={colors.light.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chrome: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  chromeState: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surfaceMuted,
  },
});
