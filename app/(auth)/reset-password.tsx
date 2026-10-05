import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useResetPasswordMutation } from '@/api/hooks/useAuth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { AuthScreen, AuthSwitchLink } from '@/features/auth/AuthScreen';
import { spacing } from '@/theme';

/**
 * Runtime: app/(auth)/reset-password → AuthScreen
 * Deep-link: ?token=...&email=...
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const reset = useResetPasswordMutation();
  const [email, setEmail] = useState(typeof params.email === 'string' ? params.email : '');
  const [token, setToken] = useState(typeof params.token === 'string' ? params.token : '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await reset.mutateAsync({
        token,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(result.status);
      setTimeout(() => router.replace('/(auth)/login'), 900);
    } catch (err) {
      if (err instanceof ApiClientError) {
        const firstFieldError = err.validationErrors
          ? Object.values(err.validationErrors)[0]?.[0]
          : undefined;
        setError(firstFieldError ?? err.message);
        return;
      }
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthScreen
      title="Choose a new password"
      subtitle="Almost there — pick something secure, then you’re back to your Moments."
      footer={
        <AuthSwitchLink
          prompt="All set?"
          actionLabel="Back to sign in"
          href="/(auth)/login"
        />
      }
    >
      <TextField
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {!params.token ? (
        <TextField label="Reset token" value={token} onChangeText={setToken} />
      ) : null}
      <TextField
        label="New password"
        placeholder="Enter a new password"
        isPassword
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        label="Confirm password"
        placeholder="Confirm your password"
        isPassword
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />
      {message ? <StatusBanner message={message} tone="success" /> : null}
      {error ? <StatusBanner message={error} tone="error" /> : null}
      <View style={styles.cta}>
        <Button
          label="Update password"
          onPress={() => void onSubmit()}
          loading={reset.isPending}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: spacing.sm,
  },
});
