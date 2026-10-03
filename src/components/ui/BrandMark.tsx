import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

type Props = {
  size?: 'sm' | 'md';
};

/** Compact brand mark for auth headers — not a copy of any reference logo. */
export function BrandMark({ size = 'md' }: Props) {
  const dim = size === 'sm' ? 48 : 64;
  return (
    <View style={[styles.wrap, { width: dim, height: dim, borderRadius: dim / 2 }]}>
      <LinearGradient
        colors={[colors.brand.pink, colors.brand.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: dim / 2 }]}
      >
        <Text style={[styles.letter, size === 'sm' && styles.letterSm]}>O</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    shadowColor: colors.brand.pink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
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
    fontSize: 28,
    lineHeight: 32,
  },
  letterSm: {
    fontSize: 22,
    lineHeight: 26,
  },
});
