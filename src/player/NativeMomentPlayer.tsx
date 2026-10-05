/**
 * Full-screen native Moment Player — owner preview only.
 *
 * Consumes a `MomentConfig` (same shape as `MomentConfigBuilder::build()`),
 * resolves it to an ordered scene list (`resolveMomentScenes`), and plays
 * through it: auto-advance by duration, tap to advance, `manualAdvance`
 * scenes (lock / question / styled countdown) drive their own completion.
 *
 * This is the *preview* surface — it never calls activate/publish APIs.
 * `onClose` is the only way out besides the CTA restart action.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { fontFamilies, spacing } from '@/theme';

import type { MomentConfig } from './momentConfig';
import { resolveNativeMomentTheme, withAlpha } from './nativeTheme';
import {
  resolveEffectiveDurationSeconds,
  resolveMomentScenes,
  type NativeSceneProps,
  type ResolvedScene,
} from './resolveNativeScenes';
import { SceneCountdown } from './scenes/SceneCountdown';
import { SceneCta } from './scenes/SceneCta';
import { SceneFinalMessage } from './scenes/SceneFinalMessage';
import { SceneGallery } from './scenes/SceneGallery';
import { SceneLock } from './scenes/SceneLock';
import { SceneMemoryImage } from './scenes/SceneMemoryImage';
import { SceneMessage } from './scenes/SceneMessage';
import { ScenePreload } from './scenes/ScenePreload';
import { SceneQuestion } from './scenes/SceneQuestion';
import { SceneQuote } from './scenes/SceneQuote';
import { SceneTitle } from './scenes/SceneTitle';

type SceneComponentType = (props: NativeSceneProps) => JSX.Element;

const SCENE_COMPONENTS: Record<string, SceneComponentType> = {
  lock: SceneLock,
  preload: ScenePreload,
  title: SceneTitle,
  gallery: SceneGallery,
  countdown: SceneCountdown,
  question: SceneQuestion,
  messageReveal: SceneMessage,
  memoryImage: SceneMemoryImage,
  finalMessage: SceneFinalMessage,
  cta: SceneCta,
  quote: SceneQuote,
};

type Props = {
  config: MomentConfig;
  onClose: () => void;
};

export function NativeMomentPlayer({ config, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { backgroundColors, textColor } = resolveNativeMomentTheme(config.theme);

  const scenes = useMemo(() => resolveMomentScenes(config), [config]);
  const [index, setIndex] = useState(0);
  const [renderKey, setRenderKey] = useState(0);
  const lastAdvanceAt = useRef(0);

  const scene = scenes[index] ?? null;

  const mergedScene: ResolvedScene | null = useMemo(() => {
    if (!scene) return null;
    return { ...scene, props: { ...config.content, ...(scene.props ?? {}) } };
  }, [scene, config.content]);

  const manualAdvance = Boolean(mergedScene?.props.manualAdvance);
  const isLastScene = index >= scenes.length - 1;

  const advance = useCallback(() => {
    const now = Date.now();
    // Guard against a double-advance when a scene's own completion and the
    // player's timer land within the same tick (mirrors `useMomentTimeline`).
    if (now - lastAdvanceAt.current < 300) return;
    lastAdvanceAt.current = now;
    setIndex((current) => Math.min(current + 1, scenes.length - 1));
  }, [scenes.length]);

  const restart = useCallback(() => {
    lastAdvanceAt.current = 0;
    setIndex(0);
    setRenderKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!mergedScene || manualAdvance || isLastScene) return;
    const seconds = resolveEffectiveDurationSeconds(mergedScene, mergedScene.props);
    const timer = setTimeout(advance, Math.max(0.5, seconds) * 1000);
    return () => clearTimeout(timer);
    // `renderKey` forces the timer to restart after a manual restart.
  }, [mergedScene, manualAdvance, isLastScene, advance, renderKey]);

  const handleTap = useCallback(() => {
    if (manualAdvance) return;
    advance();
  }, [manualAdvance, advance]);

  if (!mergedScene) {
    return (
      <View style={[styles.root, styles.emptyRoot]}>
        <Text style={styles.emptyLabel}>Nothing to preview yet</Text>
      </View>
    );
  }

  const SceneComponent = SCENE_COMPONENTS[mergedScene.id];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={backgroundColors}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Pressable style={StyleSheet.absoluteFill} onPress={handleTap} accessibilityRole="none" />

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <Animated.View
          key={`${renderKey}-${index}`}
          entering={FadeIn.duration(320)}
          style={styles.stage}
          pointerEvents="box-none"
        >
          {SceneComponent ? (
            <SceneComponent config={config} scene={mergedScene} onAdvance={advance} onRestart={restart} />
          ) : (
            <View style={styles.emptyRoot}>
              <Text style={styles.emptyLabel}>Unsupported scene</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {scenes.length > 1 && mergedScene.id !== 'preload' && mergedScene.id !== 'cta' ? (
        <View pointerEvents="none" style={[styles.progressRow, { top: insets.top + spacing.xs }]}>
          {scenes.map((s, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i <= index ? textColor : withAlpha(textColor, 0.28),
                  flex: 1,
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      <View
        style={[styles.topBar, { top: insets.top + spacing.xs + 3 + spacing.md }]}
        pointerEvents="box-none"
      >
        <View style={[styles.badge, { backgroundColor: withAlpha(textColor, 0.14) }]}>
          <Text style={[styles.badgeLabel, { color: textColor }]}>Preview</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close preview"
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: withAlpha(textColor, 0.14) }]}
        >
          <Ionicons name="close" size={18} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1218',
  },
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  stage: {
    flex: 1,
  },
  progressRow: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    height: 3,
    borderRadius: 2,
  },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeLabel: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
