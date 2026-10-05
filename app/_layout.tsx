import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LoadingState } from '@/components/ui/LoadingState';
import { AppProviders } from '@/providers/AppProviders';
import { useAuthStore } from '@/state/authStore';
import { useOnboardingStore } from '@/state/onboardingStore';
import { colors } from '@/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const bootstrapAuth = useAuthStore((s) => s.bootstrap);
  const onboardingCompleted = useOnboardingStore((s) => s.completed);
  const bootstrapOnboarding = useOnboardingStore((s) => s.bootstrap);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void bootstrapAuth();
    void bootstrapOnboarding();
  }, [bootstrapAuth, bootstrapOnboarding]);

  useEffect(() => {
    if (status === 'bootstrapping' || onboardingCompleted === null) return;

    const parts = segments as string[];
    const root = parts[0];
    const nested = parts[1];
    const inAuthGroup = root === '(auth)';
    const onOnboarding = inAuthGroup && nested === 'onboarding';
    const onReset = inAuthGroup && nested === 'reset-password';
    const inPlayer =
      root === 'player' ||
      root === 'm' ||
      (root === '(app)' && nested === 'player');

    // Recipient Moment Player is reachable without login (mirrors web /m/{token}).
    if (inPlayer) return;

    // Password reset deep links must remain reachable before onboarding/auth choice.
    if (onReset) return;

    if (status === 'authenticated') {
      if (inAuthGroup) {
        router.replace('/(app)/(tabs)');
      }
      return;
    }

    // Anonymous
    if (!onboardingCompleted) {
      if (!onOnboarding) {
        router.replace('/(auth)/onboarding');
      }
      return;
    }

    if (!inAuthGroup) {
      router.replace('/(auth)/welcome');
      return;
    }

    // Completed onboarding but still on onboarding route → welcome
    if (onOnboarding) {
      router.replace('/(auth)/welcome');
    }
  }, [status, onboardingCompleted, segments, router]);

  if (status === 'bootstrapping' || onboardingCompleted === null) {
    return <LoadingState branded />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <AuthGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.light.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen
            name="player/[publicToken]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="m/[publicToken]"
            options={{
              headerShown: false,
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthGate>
    </AppProviders>
  );
}

