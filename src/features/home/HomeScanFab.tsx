import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { PressableScale } from '@/animation/PressableScale';
import { colors, radii, shadows, spacing } from '@/theme';

/**
 * Fixed Home FAB — opens QR scan. Positioned above the floating tab bar.
 */
export function HomeScanFab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Tab bar wrap: ~64 bar + bottom padding
  const bottom = Math.max(insets.bottom, 10) + 76;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom, left: spacing.lg }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Scan a Moment QR code"
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/(app)/scan');
        }}
        style={styles.fab}
      >
        <LinearGradient
          colors={[colors.brand.pink, colors.brand.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="qr-code" size={26} color="#fff" />
        </LinearGradient>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    zIndex: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    overflow: 'hidden',
    ...shadows.cta,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
