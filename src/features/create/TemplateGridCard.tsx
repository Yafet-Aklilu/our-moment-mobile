import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/animation/PressableScale';
import {
  AUDIENCE_FALLBACK_COLORS,
  audienceLabel,
} from '@/features/create/audience';
import { colors, motion, radii, shadows, spacing, typography } from '@/theme';
import type { TemplateSummary } from '@/types/api';
import { coverImageUrlForGrid } from '@/utils/coverImage';

type Props = {
  template: TemplateSummary;
  index: number;
  disabled?: boolean;
  onPress: () => void;
};

const GAP = spacing.sm;

export function TemplateGridCard({ template, index, disabled, onPress }: Props) {
  const { width } = useWindowDimensions();
  const horizontalPad = spacing.lg * 2;
  const cardWidth = (width - horizontalPad - GAP) / 2;
  const imageHeight = cardWidth * (10 / 9);

  const coverUrl = coverImageUrlForGrid(template.cover_image);
  const [loading, setLoading] = useState(Boolean(coverUrl));
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(coverUrl) && !failed;
  const tag = audienceLabel(template.audience);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 35)
        .duration(motion.duration.normal)
        .springify()}
      style={{ width: cardWidth }}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Start creating ${template.title || template.name}`}
        disabled={disabled}
        onPress={onPress}
        style={[styles.card, shadows.card, disabled && styles.disabled]}
      >
        <View style={[styles.imageWrap, { height: imageHeight }]}>
          {showImage ? (
            <Image
              source={{ uri: coverUrl! }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={220}
              cachePolicy="memory-disk"
              recyclingKey={`template-${template.id}`}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
            />
          ) : (
            <LinearGradient
              colors={[...AUDIENCE_FALLBACK_COLORS]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.brand.pink} />
            </View>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={2}>
            {template.title || template.name}
          </Text>
          {template.short_description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {template.short_description}
            </Text>
          ) : null}
          <Text style={styles.cta}>Start creating</Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  disabled: {
    opacity: 0.55,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: colors.light.surfaceMuted,
    overflow: 'hidden',
  },
  tag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(250,247,242,0.92)',
  },
  tagText: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,247,242,0.35)',
  },
  meta: {
    padding: spacing.sm,
    gap: 4,
    minHeight: 96,
  },
  title: {
    ...typography.subtitle,
    fontSize: 15,
    lineHeight: 20,
  },
  desc: {
    ...typography.caption,
    flex: 1,
  },
  cta: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 12,
    marginTop: 2,
  },
});
