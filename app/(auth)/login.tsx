import { Link } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLoginMutation } from '@/api/hooks/useAuth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { TextField } from '@/components/ui/TextField';
import { AuthScreen, AuthSwitchLink } from '@/features/auth/AuthScreen';
import { colors, spacing, typography } from '@/theme';

/**
 * Runtime: app/(auth)/login → AuthScreen + TextField + Button
 * Visual: pink→yellow wash + white floating card (GuestLayout parity).
 */
export default function LoginScreen() {
  const login = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    setFormError(null);
    try {
      await login.mutateAsync({
        email: email.trim(),
        password,
        device_name: Platform.OS,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setFormError(err.message);
        return;
      }
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthScreen
      title="Sign in"
      subtitle="Welcome back — your Moments are waiting."
      footer={
        <AuthSwitchLink
          prompt="Don't have an account?"
          actionLabel="Sign up"
          href="/(auth)/register"
        />
      }
    >
      <TextField
        label="Email"
        placeholder="Your email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
      />
      <TextField
        label="Password"
        placeholder="Your password"
        isPassword
        autoComplete="password"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        returnKeyType="go"
        onSubmitEditing={() => void onSubmit()}
      />

      <View style={styles.row}>
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        </Link>
      </View>

      {formError ? <StatusBanner message={formError} tone="error" /> : null}

      <View style={styles.cta}>
        <Button label="Sign in" onPress={() => void onSubmit()} loading={login.isPending} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
    marginTop: -spacing.xxs,
  },
  forgot: {
    ...typography.label,
    color: colors.brand.pinkDeep,
  },
  cta: {
    marginTop: spacing.sm,
  },
});
