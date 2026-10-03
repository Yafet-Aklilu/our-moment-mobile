import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatarView } from '@/features/account/ProfileAvatarView';
import type { ProfileAvatar } from '@/state/profileStore';
import { colors, spacing, typography } from '@/theme';

type Props = {
  firstName: string;
  /** Full display name for initials fallback */
  name?: string | null;
  avatar: ProfileAvatar | null;
  reactionCount: number;
};

export function HomeHeader({ firstName, name, avatar, reactionCount }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <ProfileAvatarView size={44} name={name ?? firstName} avatar={avatar} />
        <View style={styles.textCol}>
          <Text style={styles.hello}>Hello, {firstName}</Text>
          <Text style={styles.sub}>Ready to give someone a moment?</Text>
        </View>
      </View>

      <Link href="/(app)/(tabs)/reactions" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reactions"
          hitSlop={8}
          style={styles.bell}
        >
          <Ionicons name="heart-outline" size={22} color={colors.light.text} />
          {reactionCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {reactionCount > 9 ? '9+' : reactionCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  hello: {
    ...typography.subtitle,
  },
  sub: {
    ...typography.caption,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.brand.pink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
  },
});
