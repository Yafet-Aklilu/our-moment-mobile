import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fontFamilies, radii, spacing } from '@/theme';
import { resolveMediaUrl } from '@/player/mediaUrl';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';
import type { MomentImage } from '@/player/momentConfig';

/** Native port of `SceneMemoryImage.vue` — full-bleed framed photo + caption. */
export function SceneMemoryImage({ config, scene }: NativeSceneProps) {
  const { mutedColor } = resolveNativeMomentTheme(config.theme);
  const insets = useSafeAreaInsets();

  const images = (scene.props.images as MomentImage[] | undefined) ?? config.content.images ?? [];
  const imageIndex = typeof scene.props.imageIndex === 'number' ? scene.props.imageIndex : 0;
  const image = images[imageIndex] ?? null;
  const url = resolveMediaUrl(image?.url);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: Math.max(spacing.xxl, insets.top + spacing.xl), paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.lg) },
      ]}
    >
      <View style={styles.frame}>
        {url ? (
          <Image
            source={{ uri: url }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            accessibilityLabel={image?.alt ?? 'A shared memory'}
          />
        ) : (
          <View style={[styles.empty, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
            <Ionicons name="image-outline" size={30} color={mutedColor} />
          </View>
        )}
      </View>
      {image?.caption ? (
        <Text style={[styles.caption, { color: mutedColor }]}>{image.caption}</Text>
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
  frame: {
    width: '100%',
    maxWidth: 480,
    aspectRatio: 4 / 5,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  empty: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 360,
  },
});
