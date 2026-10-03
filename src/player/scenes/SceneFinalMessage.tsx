import { StyleSheet, Text } from 'react-native';

import { fontFamilies } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

import { SceneFrame } from './SceneFrame';

/** Native port of `SceneFinalMessage.vue` — closing signature line. */
export function SceneFinalMessage({ config, scene }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const finalMessage = String(scene.props.finalMessage ?? config.content.finalMessage ?? '');

  return (
    <SceneFrame eyebrow="With love" textColor={textColor} mutedColor={mutedColor}>
      <Text style={[styles.text, { color: textColor }]}>{finalMessage}</Text>
    </SceneFrame>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamilies.headline,
    fontSize: 26,
    lineHeight: 33,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
});
