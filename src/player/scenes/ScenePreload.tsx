import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamilies, spacing } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

/** Brief loading beat before the moment starts — native port of `ScenePreload.vue`. */
export function ScenePreload({ config }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);

  return (
    <View style={styles.root}>
      <View style={styles.mark}>
        <Ionicons name="gift-outline" size={30} color={textColor} />
      </View>
      <Text style={[styles.label, { color: mutedColor }]}>Opening your moment</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 11,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
  },
});
