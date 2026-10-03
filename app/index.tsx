import { Redirect } from 'expo-router';

import { useAuthStore } from '@/state/authStore';
import { useOnboardingStore } from '@/state/onboardingStore';

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const onboardingCompleted = useOnboardingStore((s) => s.completed);

  if (status === 'bootstrapping' || onboardingCompleted === null) {
    return null;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
