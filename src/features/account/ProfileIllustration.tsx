import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

export type IllustrationDef = {
  id: string;
  name: string;
  colors: readonly [string, string, ...string[]];
};

/**
 * Original geometric avatar art — OurMoment-warm, no emoji, no third-party assets.
 */
export const PROFILE_ILLUSTRATIONS: IllustrationDef[] = [
  {
    id: 'sunrise',
    name: 'Sunrise',
    colors: ['#FF6C71', '#FFBC3A', '#FFF5F0'],
  },
  {
    id: 'bloom',
    name: 'Bloom',
    colors: ['#E85A5F', '#FF8A6B', '#FFBC3A'],
  },
  {
    id: 'dusk',
    name: 'Dusk',
    colors: ['#1C1814', '#FF6C71', '#FFBC3A'],
  },
  {
    id: 'meadow',
    name: 'Meadow',
    colors: ['#FFBC3A', '#FFE8A3', '#FFF5F0'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: ['#FF8A6B', '#FF6C71', '#FFBC3A'],
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: ['#C94C51', '#FF6C71', '#FFBC3A'],
  },
  {
    id: 'pearl',
    name: 'Pearl',
    colors: ['#FFF5F0', '#FFD0C8', '#FFBC3A'],
  },
  {
    id: 'velvet',
    name: 'Velvet',
    colors: ['#2A1F24', '#E85A5F', '#FFBC3A'],
  },
];

type Props = {
  id: string;
  size: number;
};

/** Renders a built-in illustration by id. */
export function ProfileIllustration({ id, size }: Props) {
  const def =
    PROFILE_ILLUSTRATIONS.find((i) => i.id === id) ?? PROFILE_ILLUSTRATIONS[0];

  return (
    <View style={[styles.clip, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={[def.colors[0], def.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft orbs — unique silhouette per id via layout offsets */}
      <View
        style={[
          styles.orb,
          {
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: size,
            backgroundColor: def.colors[2] ?? colors.brand.soft,
            opacity: 0.55,
            top: size * orbOffset(id).y,
            left: size * orbOffset(id).x,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size,
            backgroundColor: '#FFFFFF',
            opacity: 0.28,
            top: size * secondaryOrb(id).y,
            left: size * secondaryOrb(id).x,
          },
        ]}
      />
      <View
        style={[
          styles.band,
          {
            height: size * 0.12,
            top: size * bandTop(id),
            backgroundColor: 'rgba(255,255,255,0.22)',
            transform: [{ rotate: `${bandRotate(id)}deg` }],
          },
        ]}
      />
    </View>
  );
}

function orbOffset(id: string) {
  const map: Record<string, { x: number; y: number }> = {
    sunrise: { x: 0.35, y: 0.4 },
    bloom: { x: 0.15, y: 0.2 },
    dusk: { x: 0.45, y: 0.15 },
    meadow: { x: 0.25, y: 0.45 },
    aurora: { x: 0.05, y: 0.3 },
    ember: { x: 0.4, y: 0.35 },
    pearl: { x: 0.2, y: 0.25 },
    velvet: { x: 0.3, y: 0.1 },
  };
  return map[id] ?? { x: 0.3, y: 0.3 };
}

function secondaryOrb(id: string) {
  const map: Record<string, { x: number; y: number }> = {
    sunrise: { x: 0.05, y: 0.1 },
    bloom: { x: 0.5, y: 0.5 },
    dusk: { x: 0.1, y: 0.55 },
    meadow: { x: 0.55, y: 0.1 },
    aurora: { x: 0.55, y: 0.55 },
    ember: { x: 0.05, y: 0.55 },
    pearl: { x: 0.5, y: 0.45 },
    velvet: { x: 0.55, y: 0.4 },
  };
  return map[id] ?? { x: 0.5, y: 0.5 };
}

function bandTop(id: string) {
  const map: Record<string, number> = {
    sunrise: 0.62,
    bloom: 0.7,
    dusk: 0.55,
    meadow: 0.65,
    aurora: 0.4,
    ember: 0.72,
    pearl: 0.58,
    velvet: 0.48,
  };
  return map[id] ?? 0.6;
}

function bandRotate(id: string) {
  const map: Record<string, number> = {
    sunrise: -12,
    bloom: 8,
    dusk: -18,
    meadow: 4,
    aurora: -28,
    ember: 14,
    pearl: -6,
    velvet: 22,
  };
  return map[id] ?? 0;
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
  },
  band: {
    position: 'absolute',
    left: -20,
    right: -20,
  },
});
