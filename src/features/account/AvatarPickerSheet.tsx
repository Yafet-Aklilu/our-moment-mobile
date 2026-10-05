import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PROFILE_ILLUSTRATIONS,
  ProfileIllustration,
} from '@/features/account/ProfileIllustration';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  visible: boolean;
  selectedId?: string | null;
  onClose: () => void;
  onSelectIllustration: (id: string) => void;
  onPickPhoto: () => void;
  onUseInitials: () => void;
};

export function AvatarPickerSheet({
  visible,
  selectedId,
  onClose,
  onSelectIllustration,
  onPickPhoto,
  onUseInitials,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.md },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Choose a look</Text>
          <Text style={styles.sub}>
            Illustrations and photos stay on this device for now.
          </Text>

          <Pressable style={styles.actionRow} onPress={onPickPhoto}>
            <View style={styles.actionIcon}>
              <Ionicons name="image-outline" size={22} color={colors.brand.pinkDeep} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Upload a photo</Text>
              <Text style={styles.actionHint}>Saved on this device only</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textMuted} />
          </Pressable>

          <Pressable style={styles.actionRow} onPress={onUseInitials}>
            <View style={styles.actionIcon}>
              <Ionicons name="person-outline" size={22} color={colors.brand.pinkDeep} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Use initials</Text>
              <Text style={styles.actionHint}>Simple brand fallback</Text>
            </View>
          </Pressable>

          <Text style={styles.section}>Illustrations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          >
            {PROFILE_ILLUSTRATIONS.map((item) => {
              const active = selectedId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onSelectIllustration(item.id)}
                  style={styles.illustItem}
                >
                  <View style={[styles.illustRing, active && styles.illustRingActive]}>
                    <ProfileIllustration id={item.id} size={64} />
                  </View>
                  <Text style={styles.illustName}>{item.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28,24,20,0.35)',
  },
  sheet: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.light.borderStrong,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.titleSmall,
  },
  sub: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.brand.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  actionHint: {
    ...typography.caption,
  },
  section: {
    ...typography.label,
    marginTop: spacing.sm,
    color: colors.light.textSecondary,
  },
  grid: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingRight: spacing.lg,
  },
  illustItem: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  illustRing: {
    borderRadius: 36,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  illustRingActive: {
    borderColor: colors.brand.pink,
  },
  illustName: {
    ...typography.caption,
    fontSize: 11,
  },
});
