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
  isPassword?: boolean;
};

/**
 * Soft auth field — cream fill, rounded-2xl feel, pink focus ring.
 * Matches redesigned web GuestLayout inputs.
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
          placeholderTextColor="rgba(138,106,114,0.7)"
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
              color={focused ? colors.brand.pinkDeep : colors.light.textMuted}
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
    gap: 8,
  },
  label: {
    ...typography.label,
    color: '#2a1f24',
    fontSize: 14,
  },
  inputShell: {
    minHeight: 56,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#eadfd4',
    backgroundColor: '#FFFBF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.brand.pink,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.brand.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  inputError: {
    borderColor: colors.brand.pinkDeep,
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: '#2a1f24',
    fontSize: 16,
  },
  toggle: {
    paddingLeft: spacing.xs,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
  },
});
