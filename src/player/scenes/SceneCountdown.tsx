import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { fontFamilies, spacing } from '@/theme';
import { resolveMediaUrl } from '@/player/mediaUrl';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

import { SceneFrame } from './SceneFrame';

/**
 * `countdown` scene — native port of `SceneCountdown.vue`.
 *
 * Two modes:
 * - Styled (`props.style` set): ticks down from `props.duration` seconds and
 *   calls `onAdvance()` itself once it hits zero (it carries
 *   `manualAdvance: true`, so the player's timer never fires for it).
 * - Date-based fallback (no `style`): ticks toward `content.countdownTarget`
 *   for display only — `NativeMomentPlayer` computes the real advance
 *   timing from the same target (see `resolveEffectiveDurationSeconds`).
 *
 * `NativeMomentPlayer` remounts scenes on every scene change (see its
 * `key` prop), so this component always starts fresh — safe to derive
 * initial display state once via lazy `useState` initializers.
 */
export function SceneCountdown({ config, scene, onAdvance }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const props = scene.props;

  const isStyled = Boolean(props.style);
  const label = String(props.text ?? '') || 'Counting down';
  const headImage = resolveMediaUrl(typeof props.headImage === 'string' ? props.headImage : null);
  const endIcon = resolveMediaUrl(typeof props.endIcon === 'string' ? props.endIcon : null);
  const target =
    typeof props.countdownTarget === 'string' ? props.countdownTarget : config.content.countdownTarget;

  const initialSeconds = Number(props.duration ?? scene.duration ?? 10);
  const initialRemaining = Number.isFinite(initialSeconds) && initialSeconds > 0 ? Math.round(initialSeconds) : 10;

  const targetMs = target ? new Date(target).getTime() : NaN;
  const hasValidTarget = Number.isFinite(targetMs);

  const [display, setDisplay] = useState(() =>
    isStyled ? String(initialRemaining) : hasValidTarget ? formatDateDiff(targetMs) : '—',
  );
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isStyled) return;
    let remaining = initialRemaining;
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        setDisplay('0');
        setFinished(true);
        onAdvance();
        return;
      }
      setDisplay(String(remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStyled, initialRemaining, onAdvance]);

  useEffect(() => {
    if (isStyled || !hasValidTarget) return;
    const interval = setInterval(() => setDisplay(formatDateDiff(targetMs)), 1000);
    return () => clearInterval(interval);
  }, [isStyled, hasValidTarget, targetMs]);

  return (
    <SceneFrame eyebrow={label} textColor={textColor} mutedColor={mutedColor}>
      {headImage ? (
        <Image source={{ uri: headImage }} style={styles.headImage} contentFit="cover" />
      ) : null}
      {finished && endIcon ? (
        <Image source={{ uri: endIcon }} style={styles.endIcon} contentFit="contain" />
      ) : (
        <Text style={[styles.value, { color: textColor }]}>{display}</Text>
      )}
    </SceneFrame>
  );
}

function formatDateDiff(targetMs: number): string {
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  headImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing.lg,
  },
  endIcon: {
    width: 64,
    height: 64,
  },
  value: {
    fontFamily: fontFamilies.headlineMedium,
    fontSize: 56,
    letterSpacing: 0.5,
  },
});
