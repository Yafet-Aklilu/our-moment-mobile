import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, motion, radii, shadows, spacing } from '@/theme';

/**
 * Floating bottom tab bar — icons only, expanding active pill.
 */
type TabVisual = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
};

const TAB_VISUALS: Record<string, TabVisual> = {
  index: { label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  moments: { label: 'Moments', icon: 'heart-outline', iconFocused: 'heart' },
  create: { label: 'Create', icon: 'add-circle-outline', iconFocused: 'add-circle' },
  reactions: {
    label: 'Reactions',
    icon: 'chatbubble-ellipses-outline',
    iconFocused: 'chatbubble-ellipses',
  },
  account: { label: 'Account', icon: 'person-outline', iconFocused: 'person' },
};

function TabItem({
  routeName,
  focused,
  onPress,
  onLongPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const visual = TAB_VISUALS[routeName] ?? {
    label: routeName,
    icon: 'ellipse-outline' as const,
    iconFocused: 'ellipse' as const,
  };
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, motion.spring.tab);
  }, [focused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: focused ? colors.tabBar.activePill : 'transparent',
    transform: [{ scale: 0.94 + progress.value * 0.06 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={visual.label}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      onLongPress={onLongPress}
      style={styles.itemHit}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        <Ionicons
          name={focused ? visual.iconFocused : visual.icon}
          size={24}
          color={focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon}
        />
      </Animated.View>
    </Pressable>
  );
}

/** Accept Expo Router's tabBar props without fighting duplicate RN type packages. */
export function FloatingTabBar(props: BottomTabBarProps | Record<string, unknown>) {
  const { state, descriptors, navigation } = props as BottomTabBarProps;
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.bar, shadows.tabBar]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if ((options as { href?: string | null }).href === null) {
            return null;
          }

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.tabBar.background,
    borderRadius: radii.tabBar,
    borderWidth: 1,
    borderColor: colors.tabBar.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    minHeight: 60,
  },
  itemHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    width: 44,
    height: 44,
    borderRadius: radii.tabPill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
