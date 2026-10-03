import { StyleSheet, Text } from 'react-native';

import { fontFamilies } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

import { SceneFrame } from './SceneFrame';

/** Native port of `SceneQuote.vue` — used by the memorial preset. */
export function SceneQuote({ config, scene }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const quote = String(scene.props.quote ?? config.content.quote ?? '');

  return (
    <SceneFrame eyebrow="Remembered" textColor={textColor} mutedColor={mutedColor}>
      <Text style={[styles.quote, { color: textColor }]}>{quote}</Text>
    </SceneFrame>
  );
}

const styles = StyleSheet.create({
  quote: {
    fontFamily: fontFamilies.headlineMedium,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
});
