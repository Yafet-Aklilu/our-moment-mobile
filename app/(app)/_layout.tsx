import { Stack } from 'expo-router';

import { warmStackScreenOptions } from '@/theme';

export default function AppLayout() {
  return (
    <Stack screenOptions={warmStackScreenOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="moments/[id]/index" options={{ title: 'Your Moment' }} />
      <Stack.Screen name="moments/[id]/edit" options={{ title: 'Build your Moment' }} />
      <Stack.Screen
        name="moments/[id]/preview"
        options={{
          headerShown: false,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
      <Stack.Screen name="moments/[id]/activate" options={{ title: 'Send this Moment' }} />
      <Stack.Screen name="moments/[id]/share" options={{ title: 'Share' }} />
      <Stack.Screen
        name="scan"
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="player/[publicToken]"
        options={{
          headerShown: false,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
    </Stack>
  );
}
