import { Ionicons } from '@expo/vector-icons';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { useRegisterMutation } from '@/api/hooks/useAuth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { env } from '@/config/env';
import { AuthScreen, AuthSwitchLink } from '@/features/auth/AuthScreen';
import { colors, spacing, typography } from '@/theme';

export default function RegisterScreen() {
  const register = useRegisterMutation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [terms, setTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    setFormError(null);
    if (!terms) {
      setFormError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }
    try {
      await register.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        terms: true,
        device_name: Platform.OS,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        const firstFieldError = err.validationErrors
          ? Object.values(err.validationErrors)[0]?.[0]
          : undefined;
        setFormError(firstFieldError ?? err.message);
        return;
      }
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthScreen
      title="Sign up"
      subtitle="Give someone a moment they can open — and keep."
      footer={
        <AuthSwitchLink
          prompt="Already have an account?"
          actionLabel="Log in"
          href="/(auth)/login"
        />
      }
    >
      <TextField
        label="Full name"
        placeholder="Enter your full name"
        autoComplete="name"
        textContentType="name"
        value={name}
        onChangeText={setName}
      />
      <TextField
        label="Email"
        placeholder="Your email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Password"
        placeholder="Create a password"
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        label="Confirm password"
        placeholder="Confirm your password"
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: terms }}
        onPress={() => setTerms((v) => !v)}
        style={styles.termsRow}
      >
        <View style={[styles.checkbox, terms && styles.checkboxOn]}>
          {terms ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </View>
        <Text style={styles.termsText}>
          I accept the{' '}
          <Text
            style={styles.termsLink}
            onPress={() => void Linking.openURL(`${env.webOrigin}/terms`)}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.termsLink}
            onPress={() => void Linking.openURL(`${env.webOrigin}/privacy`)}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </Pressable>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button
        label="Create Account"
        onPress={() => void onSubmit()}
        loading={register.isPending}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: colors.light.surface,
  },
  checkboxOn: {
    backgroundColor: colors.brand.charcoal,
    borderColor: colors.brand.charcoal,
  },
  termsText: {
    ...typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textSecondary,
  },
  termsLink: {
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  error: {
    ...typography.caption,
    color: colors.light.danger,
  },
});
