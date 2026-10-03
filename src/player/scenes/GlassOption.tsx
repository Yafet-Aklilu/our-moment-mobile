/**
 * Translucent "glass" pill button used by lock + question scenes —
 * native approximation of the web scenes' frosted option/answer buttons
 * (`YesNoQuestion.vue`, `MultipleChoiceQuestion.vue`, lock keypads/hearts).
 * Renders on top of any moment background, so it uses its own
 * theme-aware translucency rather than the app's light chrome tokens.
 */
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { fontFamilies, radii, spacing, touchMin } from '@/theme';
import { withAlpha } from '@/player/nativeTheme';

type State = 'idle' | 'selected' | 'success' | 'wrong';

type Props = {
  label: string;
  badge?: string;
  state?: State;
  textColor: string;
  accentColor: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function GlassOption({
  label,
  badge,
  state = 'idle',
  textColor,
  accentColor,
  onPress,
  disabled,
  style,
}: Props) {
  const [shakeX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (state !== 'wrong') return;
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -7, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 7, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -5, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  }, [state, shakeX]);

  const isSuccess = state === 'success';
  const isSelected = state === 'selected' || isSuccess;

  return (
    <Animated.View style={{ width: '100%', transform: [{ translateX: shakeX }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.base,
          { borderColor: withAlpha(textColor, 0.28), backgroundColor: withAlpha(textColor, 0.12) },
          isSuccess ? { borderColor: withAlpha('#6EE7B7', 0.6), backgroundColor: 'rgba(110,231,183,0.16)' } : null,
          isSelected && !isSuccess ? { transform: [{ scale: 0.985 }] } : null,
          disabled ? styles.disabled : null,
          style,
        ]}
      >
        {badge ? (
          <View style={[styles.badge, { backgroundColor: withAlpha(textColor, 0.14) }]}>
            <Text style={[styles.badgeLabel, { color: textColor }]}>{badge}</Text>
          </View>
        ) : null}
        <Text style={[styles.label, { color: textColor }]} numberOfLines={3}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: touchMin + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.6,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
  },
  label: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 16,
    textAlign: 'center',
    flexShrink: 1,
  },
});
