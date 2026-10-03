import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamilies, spacing, touchMin } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

/**
 * `cta` scene — native port of `SceneCTA.vue`, scoped to the preview
 * context: only the "watch again" restart action applies here (no
 * activation, share-to-story, or reaction CTAs — those belong to the
 * public/recipient view, not the owner preview).
 */
export function SceneCta({ config, onRestart }: NativeSceneProps) {
  const { textColor, mutedColor, accentColor } = resolveNativeMomentTheme(config.theme);
  const ctaTitle = typeof config.theme.ctaTitle === 'string' ? config.theme.ctaTitle : '';
  const ctaSubtitle =
    typeof config.theme.ctaSubtitle === 'string' && config.theme.ctaSubtitle
      ? config.theme.ctaSubtitle
      : 'This moment is yours to keep.';

  return (
    <View style={styles.root}>
      {ctaTitle ? <Text style={[styles.title, { color: textColor }]}>{ctaTitle}</Text> : null}
      <Text style={[styles.subtitle, { color: mutedColor }]}>{ctaSubtitle}</Text>

      {onRestart ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Watch again"
          onPress={onRestart}
          style={({ pressed }) => [
            styles.restart,
            { borderColor: accentColor, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons name="refresh" size={16} color={textColor} />
          <Text style={[styles.restartLabel, { color: textColor }]}>Watch again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fontFamilies.headline,
    fontSize: 26,
    lineHeight: 33,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  restart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchMin,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  restartLabel: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 15,
  },
});
