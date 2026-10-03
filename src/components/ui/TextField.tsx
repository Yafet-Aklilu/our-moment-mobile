import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Enables show/hide control when the field is a password. */
  isPassword?: boolean;
};

/**
 * Auth-oriented text field — clear label, focus ring, password toggle.
 * Structure inspired by the reference form; OurMoment tokens for look.
 */
export function TextField({
  label,
  error,
  style,
  isPassword,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const showToggle = Boolean(isPassword || secureTextEntry);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.light.textMuted}
          style={[styles.input, style]}
          secureTextEntry={showToggle ? hidden : secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {showToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={10}
            onPress={() => setHidden((v) => !v)}
            style={styles.toggle}
          >
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.light.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
  },
  inputShell: {
    minHeight: 54,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.brand.pink,
    backgroundColor: colors.light.surfaceWarm,
  },
  inputError: {
    borderColor: colors.light.danger,
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.light.text,
  },
  toggle: {
    paddingLeft: spacing.xs,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.light.danger,
  },
});
