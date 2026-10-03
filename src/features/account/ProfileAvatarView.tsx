import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  ProfileIllustration,
  PROFILE_ILLUSTRATIONS,
} from '@/features/account/ProfileIllustration';
import type { ProfileAvatar } from '@/state/profileStore';
import { colors, typography } from '@/theme';

type Props = {
  size: number;
  name?: string | null;
  avatar: ProfileAvatar | null;
};

/** Displays illustration, local photo, or initials fallback. */
export function ProfileAvatarView({ size, name, avatar }: Props) {
  const radius = size / 2;

  if (avatar?.kind === 'local-photo' && avatar.localUri) {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
        <Image
          source={{ uri: avatar.localUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  if (avatar?.kind === 'illustration' && avatar.illustrationId) {
    const exists = PROFILE_ILLUSTRATIONS.some((i) => i.id === avatar.illustrationId);
    if (exists) {
      return (
        <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
          <ProfileIllustration id={avatar.illustrationId} size={size} />
        </View>
      );
    }
  }

  const initial = (name?.trim().charAt(0) || 'O').toUpperCase();
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      <LinearGradient
        colors={[colors.brand.pink, colors.brand.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <Text style={[styles.initial, { fontSize: size * 0.38 }]}>{initial}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceMuted,
  },
  initial: {
    ...typography.title,
    color: '#fff',
  },
});
