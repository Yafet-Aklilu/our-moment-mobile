import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useForgotPasswordMutation } from '@/api/hooks/useAuth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { AuthScreen, AuthSwitchLink } from '@/features/auth/AuthScreen';
import { spacing } from '@/theme';

/**
 * Runtime: app/(auth)/forgot-password → AuthScreen
 * Visual: same pink→yellow GuestLayout wash as Login/Register.
 */
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
      title="Forgot your password?"
      subtitle="No worries — enter your email and we’ll send a reset link if an account exists."
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
      {message ? <StatusBanner message={message} tone="success" /> : null}
      {error ? <StatusBanner message={error} tone="error" /> : null}
      <View style={styles.cta}>
        <Button
          label="Send reset link"
          onPress={() => void onSubmit()}
          loading={forgot.isPending}
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
