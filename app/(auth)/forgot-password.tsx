import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useForgotPasswordMutation } from '@/api/hooks/useAuth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { AuthScreen, AuthSwitchLink } from '@/features/auth/AuthScreen';
import { colors, typography } from '@/theme';

export default function ForgotPasswordScreen() {
  const forgot = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await forgot.mutateAsync(email.trim());
      setMessage(result.status);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 404) {
        setError('Password reset is currently unavailable.');
        return;
      }
      if (err instanceof ApiClientError) {
        setError(err.message);
        return;
      }
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthScreen
      title="Forgot password"
      subtitle="We’ll email you a reset link if an account exists for that address."
      footer={
        <AuthSwitchLink
          prompt="Remembered it?"
          actionLabel="Back to sign in"
          href="/(auth)/login"
        />
      }
    >
      <TextField
        label="Email"
        placeholder="Your email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        returnKeyType="send"
        onSubmitEditing={() => void onSubmit()}
      />
      {message ? <Text style={styles.ok}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        label="Send reset link"
        onPress={() => void onSubmit()}
        loading={forgot.isPending}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  ok: { ...typography.caption, color: colors.light.success },
  error: { ...typography.caption, color: colors.light.danger },
});
