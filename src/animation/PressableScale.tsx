import { forwardRef } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/theme';

type Props = PressableProps & {
  children: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Immediate press feedback — 60fps via Reanimated. */
export const PressableScale = forwardRef<
  React.ElementRef<typeof Pressable>,
  Props
>(function PressableScale(
  { children, onPressIn, onPressOut, style, disabled, ...rest },
  ref,
) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      ref={ref}
      disabled={disabled}
      onPressIn={(e) => {
        scale.value = withTiming(motion.scale.pressIn, {
          duration: motion.duration.instant,
        });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(motion.scale.pressOut, motion.spring.soft);
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
});
