import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { parseMomentPublicToken } from '@/linking/momentUrl';
import { colors, radii, spacing, typography } from '@/theme';

const FRAME = Math.min(Dimensions.get('window').width * 0.68, 280);

/**
 * In-app QR foundation (Flow B).
 * Recognizes canonical Moment URLs only:
 *   https://ourmoment.app/m/{public_token}
 * Does not invent a second QR payload format.
 */
export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const onBarcode = useCallback(
    ({ data }: { data: string }) => {
      if (locked) return;
      const token = parseMomentPublicToken(data);
      if (!token) {
        setHint('Not an OurMoment link. Scan a Moment QR or URL.');
        return;
      }
      setLocked(true);
      router.replace(`/player/${token}`);
    },
    [locked, router],
  );

  if (!permission) {
    return <View style={styles.centered} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Camera access</Text>
        <Text style={styles.body}>
          Allow camera access to scan an OurMoment QR code.
        </Text>
        <Button label="Allow camera" onPress={() => void requestPermission()} />
        <Button label="Go back" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onBarcode}
      />

      <View style={styles.guide} pointerEvents="none">
        <View style={styles.maskRow} />
        <View style={styles.midRow}>
          <View style={styles.maskSide} />
          <View style={[styles.frame, { width: FRAME, height: FRAME }]}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
          <View style={styles.maskSide} />
        </View>
        <View style={styles.maskRow} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close scanner"
        onPress={() => router.back()}
        style={[styles.close, { top: insets.top + spacing.sm }]}
        hitSlop={12}
      >
        <Ionicons name="close" size={22} color="#fff" />
      </Pressable>

      <View
        style={[
          styles.overlay,
          { bottom: Math.max(insets.bottom, spacing.md) + spacing.lg },
        ]}
      >
        <Text style={styles.overlayTitle}>Scan a Moment</Text>
        <Text style={styles.overlayBody}>
          Center the QR in the box. Looks like ourmoment.app/m/…
        </Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const CORNER = 28;
const THICK = 4;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.light.background,
  },
  title: { ...typography.title },
  body: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  guide: {
    ...StyleSheet.absoluteFill,
  },
  maskRow: {
    flex: 1,
    backgroundColor: 'rgba(12,10,8,0.55)',
  },
  midRow: {
    flexDirection: 'row',
    height: FRAME,
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(12,10,8,0.55)',
  },
  frame: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.brand.soft,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: THICK,
    borderLeftWidth: THICK,
    borderTopLeftRadius: 12,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: THICK,
    borderRightWidth: THICK,
    borderTopRightRadius: 12,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: THICK,
    borderLeftWidth: THICK,
    borderBottomLeftRadius: 12,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: THICK,
    borderRightWidth: THICK,
    borderBottomRightRadius: 12,
  },
  close: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(28,24,20,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: 'rgba(28,24,20,0.78)',
    gap: spacing.xs,
  },
  overlayTitle: { ...typography.titleSmall, color: '#fff' },
  overlayBody: { ...typography.body, color: 'rgba(255,245,240,0.85)' },
  hint: { ...typography.caption, color: colors.brand.yellow },
});
