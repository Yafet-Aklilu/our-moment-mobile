import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { momentsApi } from '@/api/resources/moments';
import { Button } from '@/components/ui/Button';
import { NativeMomentPlayer } from '@/player/NativeMomentPlayer';
import { asMomentConfig, isMomentConfigEmpty } from '@/player/momentConfig';
import { colors, radii, spacing, typography } from '@/theme';

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
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (preview.isError || !preview.data) {
    return (
      <View style={[styles.centered, styles.padded]}>
        <BackButton onPress={handleClose} insetsTop={insets.top} />
        <Text style={styles.title}>Preview unavailable</Text>
        <Text style={styles.body}>We couldn’t load this moment’s preview. Try again shortly.</Text>
        <Button label="Close" variant="secondary" onPress={handleClose} />
      </View>
    );
  }

  const config = asMomentConfig(preview.data.config);

  if (!config || isMomentConfigEmpty(config)) {
    return (
      <View style={[styles.centered, styles.padded]}>
        <BackButton onPress={handleClose} insetsTop={insets.top} />
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Preview</Text>
        </View>
        <Text style={styles.title}>Nothing to preview yet</Text>
        <Text style={styles.body}>
          Add a message, photo, or the other moment details first — your preview will come alive once
          there’s something to show.
        </Text>
        {preview.data.missing_steps?.length ? (
          <View style={styles.missingCard}>
            <Text style={styles.missingTitle}>Still needed</Text>
            {preview.data.missing_steps.map((step) => (
              <Text key={step} style={styles.missingItem}>
                • {step}
              </Text>
            ))}
          </View>
        ) : null}
        <View style={styles.actions}>
          <Button label="Continue editing" onPress={() => router.replace(`/(app)/moments/${momentId}/edit`)} />
          <Button label="Close" variant="secondary" onPress={handleClose} />
        </View>
      </View>
    );
  }

  return <NativeMomentPlayer config={config} onClose={handleClose} />;
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.background,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surfaceMuted,
  },
  badge: {
    backgroundColor: colors.light.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  badgeLabel: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: { ...typography.title, textAlign: 'center' },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  missingCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.light.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 2,
    marginTop: spacing.sm,
  },
  missingTitle: {
    ...typography.label,
    color: colors.light.text,
    marginBottom: spacing.xxs,
  },
  missingItem: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
