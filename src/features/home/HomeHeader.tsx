import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatarView } from '@/features/account/ProfileAvatarView';
import type { ProfileAvatar } from '@/state/profileStore';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  firstName: string;
  name?: string | null;
  avatar: ProfileAvatar | null;
  reactionCount: number;
};

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Warm personal greeting — editorial, not dashboard chrome.
 */
export function HomeHeader({ firstName, name, avatar, reactionCount }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <ProfileAvatarView size={52} name={name ?? firstName} avatar={avatar} />
        <View style={styles.textCol}>
          <Text style={styles.eyebrow}>{timeGreeting()}</Text>
          <Text style={styles.hello}>{firstName}</Text>
        </View>

        <Link href="/(app)/(tabs)/reactions" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reactions"
            hitSlop={8}
            style={styles.reactionChip}
          >
            <Ionicons name="heart" size={18} color={colors.brand.pinkDeep} />
            {reactionCount > 0 ? (
              <Text style={styles.reactionCount}>
                {reactionCount > 99 ? '99+' : reactionCount}
              </Text>
            ) : null}
          </Pressable>
        </Link>
      </View>
      <Text style={styles.sub}>Ready to give someone a Moment they’ll keep?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textCol: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: 0.4,
  },
  hello: {
    ...typography.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: '#2a1f24',
  },
  sub: {
    ...typography.body,
    color: '#6b5560',
    lineHeight: 22,
    paddingLeft: 2,
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.brand.pinkSoft,
  },
  reactionCount: {
    ...typography.label,
    color: colors.brand.pinkDeep,
    fontSize: 13,
  },
});
