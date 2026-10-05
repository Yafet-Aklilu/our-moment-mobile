import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  /** Mark + wordmark in a horizontal row (web auth logo style). */
  horizontal?: boolean;
};

/**
 * OurMoment brand mark — pink→yellow gradient + optional wordmark.
 */
export function BrandMark({ size = 'md', showWordmark = false, horizontal = false }: Props) {
  const dim = size === 'sm' ? 40 : size === 'lg' ? 72 : 56;
  const showName = showWordmark || horizontal;

  return (
    <View style={[styles.wrap, horizontal && styles.wrapHorizontal]}>
      <View style={[styles.mark, { width: dim, height: dim, borderRadius: dim * 0.28 }]}>
        <LinearGradient
          colors={[colors.brand.pink, colors.brand.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: dim * 0.28 }]}
        >
          <Text
            style={[
              styles.letter,
              size === 'sm' && styles.letterSm,
              size === 'lg' && styles.letterLg,
            ]}
          >
            O
          </Text>
        </LinearGradient>
      </View>
      {showName ? (
        <Text style={[styles.wordmark, horizontal && styles.wordmarkHorizontal, size === 'lg' && styles.wordmarkLg]}>
          OurMoment
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
  },
  wrapHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mark: {
    overflow: 'hidden',
    shadowColor: colors.brand.pink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    ...typography.title,
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 30,
  },
  letterSm: {
    fontSize: 18,
    lineHeight: 22,
  },
  letterLg: {
    fontSize: 34,
    lineHeight: 38,
  },
  wordmark: {
    ...typography.titleSmall,
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.light.text,
  },
  wordmarkHorizontal: {
    fontSize: 20,
    color: '#2a1f24',
  },
  wordmarkLg: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
});
