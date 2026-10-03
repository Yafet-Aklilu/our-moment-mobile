import { StyleSheet, Text } from 'react-native';

import { fontFamilies, spacing } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

import { SceneFrame } from './SceneFrame';

/** Native port of `SceneTitle.vue` — receiver name + optional sender subtitle. */
export function SceneTitle({ config, scene }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const title = String(scene.props.title ?? config.content.title ?? '');
  const subtitle = String(scene.props.subtitle ?? config.content.subtitle ?? '');
  const manualAdvance = Boolean(scene.props.manualAdvance);

  return (
    <SceneFrame
      eyebrow="A moment for you"
      hint={manualAdvance ? undefined : 'Tap to continue'}
      textColor={textColor}
      mutedColor={mutedColor}
    >
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</Text> : null}
    </SceneFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamilies.headline,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
