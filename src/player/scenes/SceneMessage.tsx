import { ScrollView, StyleSheet, Text } from 'react-native';

import { fontFamilies } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';
import { stripHtml } from '@/player/stripHtml';

import { SceneFrame } from './SceneFrame';

/** `messageReveal` scene — native port of `SceneMessageReveal.vue`, HTML stripped to plain text. */
export function SceneMessage({ config, scene }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const message = stripHtml(String(scene.props.message ?? config.content.message ?? ''));

  return (
    <SceneFrame eyebrow="A few words" textColor={textColor} mutedColor={mutedColor}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </ScrollView>
    </SceneFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { width: '100%', maxHeight: '100%' },
  scrollContent: { alignItems: 'center' },
  message: {
    fontFamily: fontFamilies.body,
    fontSize: 19,
    lineHeight: 28,
    textAlign: 'center',
  },
});
