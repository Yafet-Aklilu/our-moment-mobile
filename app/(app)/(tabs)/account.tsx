import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLogoutMutation, useMeQuery } from '@/api/hooks/useAuth';
import { useCreditsQuery } from '@/api/hooks/useMoments';
import { Button } from '@/components/ui/Button';
import { AccountSettingsList } from '@/features/account/AccountSettingsList';
import { AvatarPickerSheet } from '@/features/account/AvatarPickerSheet';
import { CreditsCard } from '@/features/account/CreditsCard';
import { pickAndPersistLocalAvatar } from '@/features/account/localAvatar';
import { ProfileAvatarView } from '@/features/account/ProfileAvatarView';
import { env } from '@/config/env';
import { useProfileStore } from '@/state/profileStore';
import { colors, motion, radii, shadows, spacing, typography } from '@/theme';

/**
 * Account / profile — warm personal hub.
 * Avatar illustrations + local photos are device-only (no profile photo API yet).
 */
export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const me = useMeQuery();
  const credits = useCreditsQuery();
  const logout = useLogoutMutation();

  const avatar = useProfileStore((s) => s.avatar);
  const hydrated = useProfileStore((s) => s.hydrated);
  const hydrate = useProfileStore((s) => s.hydrate);
  const setIllustration = useProfileStore((s) => s.setIllustration);
  const setLocalPhoto = useProfileStore((s) => s.setLocalPhoto);
  const clearAvatar = useProfileStore((s) => s.clearAvatar);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  const userId = me.data?.id;

  useEffect(() => {
    if (userId) {
      void hydrate(userId);
    }
  }, [userId, hydrate]);

  if (me.isLoading && !me.data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.pink} size="large" />
      </View>
    );
  }

  if (me.isError && !me.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn’t load your account</Text>
        <Button label="Try again" variant="secondary" onPress={() => void me.refetch()} />
      </View>
    );
  }

  const name = me.data?.name ?? '—';
  const email = me.data?.email ?? '';
  const creditBalance = credits.data?.credits ?? me.data?.credits ?? 0;
  const illustrationId =
    avatar?.kind === 'illustration' ? avatar.illustrationId : null;

  const onPickPhoto = async () => {
    if (!userId) return;
    setPhotoBusy(true);
    try {
      const uri = await pickAndPersistLocalAvatar(userId);
      await setLocalPhoto(userId, uri);
      setPickerOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update photo.';
      if (message !== 'cancelled') {
        Alert.alert('Photo', message);
      }
    } finally {
      setPhotoBusy(false);
    }
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'You’ll need to sign in again to manage your Moments.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => void logout.mutateAsync(),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 110, paddingTop: spacing.sm },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(motion.duration.normal).springify()}
          style={[styles.hero, shadows.card]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
            onPress={() => setPickerOpen(true)}
            style={styles.avatarPress}
          >
            {hydrated || !userId ? (
              <ProfileAvatarView size={96} name={name} avatar={avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </Pressable>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Pressable onPress={() => setPickerOpen(true)} hitSlop={8}>
            <Text style={styles.changeLook}>Change profile look</Text>
          </Pressable>
        </Animated.View>

        <CreditsCard
          credits={creditBalance}
          freePublish={Boolean(me.data?.free_moment_publish_enabled)}
        />

        <Animated.View
          entering={FadeInDown.delay(120).duration(motion.duration.normal).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          <AccountSettingsList
            rows={[
              {
                key: 'moments',
                label: 'My Moments',
                hint: 'Drafts and sent Moments',
                icon: 'heart-outline',
                href: '/(app)/(tabs)/moments',
              },
              {
                key: 'create',
                label: 'Create a Moment',
                hint: 'Choose a style and start',
                icon: 'add-circle-outline',
                href: '/(app)/(tabs)/create',
              },
              {
                key: 'scan',
                label: 'Scan a Moment',
                hint: 'Open a shared QR or link',
                icon: 'qr-code-outline',
                href: '/(app)/scan',
              },
              {
                key: 'privacy',
                label: 'Privacy policy',
                icon: 'shield-checkmark-outline',
                onPress: () => void Linking.openURL(`${env.webOrigin}/privacy`),
              },
              {
                key: 'terms',
                label: 'Terms of service',
                icon: 'document-text-outline',
                onPress: () => void Linking.openURL(`${env.webOrigin}/terms`),
              },
            ]}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(160).duration(motion.duration.normal).springify()}
        >
          <Button
            label="Sign out"
            variant="secondary"
            loading={logout.isPending}
            onPress={confirmSignOut}
          />
          <Text style={styles.footnote}>
            Profile photos sync across devices is not available yet — looks chosen here stay on
            this phone.
          </Text>
        </Animated.View>
      </ScrollView>

      <AvatarPickerSheet
        visible={pickerOpen}
        selectedId={illustrationId}
        onClose={() => setPickerOpen(false)}
        onSelectIllustration={(id) => {
          if (!userId) return;
          void setIllustration(userId, id);
          setPickerOpen(false);
        }}
        onPickPhoto={() => {
          if (photoBusy) return;
          void onPickPhoto();
        }}
        onUseInitials={() => {
          if (!userId) return;
          void clearAvatar(userId);
          setPickerOpen(false);
        }}
      />

      {photoBusy ? (
        <View style={styles.busy}>
          <ActivityIndicator color={colors.brand.pink} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.light.background,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  avatarPress: {
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.light.surfaceMuted,
  },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.surface,
  },
  name: {
    ...typography.title,
    textAlign: 'center',
  },
  email: {
    ...typography.body,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  changeLook: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    marginTop: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
  },
  footnote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  errorTitle: {
    ...typography.titleSmall,
    textAlign: 'center',
  },
  busy: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,247,242,0.55)',
  },
});
