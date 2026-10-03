import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.brand.pinkDeep,
        headerTitleStyle: { fontFamily: 'PlusJakartaSans_600SemiBold' },
        contentStyle: { backgroundColor: colors.light.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="moments/[id]/index" options={{ title: 'Moment' }} />
      <Stack.Screen name="moments/[id]/edit" options={{ title: 'Moment Builder' }} />
      <Stack.Screen
        name="moments/[id]/preview"
        options={{
          headerShown: false,
          // Lock / gallery horizontal gestures conflict with the iOS back swipe.
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
      <Stack.Screen name="moments/[id]/activate" options={{ title: 'Activate' }} />
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
