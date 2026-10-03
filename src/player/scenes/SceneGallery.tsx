import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fontFamilies, spacing } from '@/theme';
import { resolveMediaUrl } from '@/player/mediaUrl';
import { resolveNativeMomentTheme, withAlpha } from '@/player/nativeTheme';
import { getGalleryImageDurationSeconds } from '@/player/resolveNativeScenes';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';
import type { MomentImage } from '@/player/momentConfig';

/**
 * `gallery` scene — horizontal, auto-advancing photo pager. Native port of
 * `SceneGallery.vue` + `GalleryScene.vue` (simplified to one "cinematic"
 * full-bleed treatment rather than every web gallery style variant).
 *
 * Cycles through images on its own timer; the overall scene-to-scene
 * advance is still owned by `NativeMomentPlayer` (see
 * `getGallerySceneDurationSeconds`), so this only drives the in-scene pager.
 * `NativeMomentPlayer` remounts scenes on every scene change, so `active`
 * always starts fresh at `0` — no reset effect needed here.
 */
export function SceneGallery({ config, scene }: NativeSceneProps) {
  const { textColor, mutedColor } = resolveNativeMomentTheme(config.theme);
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [active, setActive] = useState(0);
  const listRef = useRef<FlatList<MomentImage>>(null);
  const advancingRef = useRef(false);

  const images = useMemo<MomentImage[]>(
    () => (scene.props.images as MomentImage[] | undefined) ?? config.content.images ?? [],
    [scene.props.images, config.content.images],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const duration = getGalleryImageDurationSeconds(images[active]) * 1000;
    const timer = setTimeout(() => {
      const next = (active + 1) % images.length;
      advancingRef.current = true;
      setActive(next);
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
    }, duration);
    return () => clearTimeout(timer);
  }, [active, images, width]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (advancingRef.current) {
        advancingRef.current = false;
        return;
      }
      if (width <= 0) return;
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setActive(Math.max(0, Math.min(images.length - 1, index)));
    },
    [images.length, width],
  );

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="images-outline" size={32} color={mutedColor} />
        <Text style={[styles.emptyLabel, { color: mutedColor }]}>No photos yet</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.root}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <GalleryPage image={item} width={width} textColor={textColor} mutedColor={mutedColor} />
        )}
      />
      <View
        style={[
          styles.dots,
          { top: Math.max(spacing.xxl, insets.top + spacing.lg) },
        ]}
      >
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === active ? textColor : withAlpha(textColor, 0.35),
                width: index === active ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function GalleryPage({
  image,
  width,
  textColor,
  mutedColor,
}: {
  image: MomentImage;
  width: number;
  textColor: string;
  mutedColor: string;
}) {
  const url = resolveMediaUrl(image.url);
  return (
    <View style={{ width, flex: 1 }}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          accessibilityLabel={image.alt ?? 'A shared memory'}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.emptyPage]}>
          <Ionicons name="image-outline" size={28} color={mutedColor} />
        </View>
      )}
      <View style={styles.captionVeil} pointerEvents="none" />
      {image.caption ? (
        <Text style={[styles.pageCaption, { color: textColor }]} numberOfLines={2}>
          {image.caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyLabel: { fontFamily: fontFamilies.body, fontSize: 15 },
  emptyPage: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  captionVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    backgroundColor: 'rgba(10,8,12,0.38)',
  },
  pageCaption: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xxl,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
});
