import { Tabs } from 'expo-router';

import { FloatingTabBar } from '@/components/navigation/FloatingTabBar';
import { colors, warmTabHeaderOptions } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...(props as object)} />}
      screenOptions={{
        ...warmTabHeaderOptions,
        sceneStyle: { backgroundColor: colors.light.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="moments" options={{ title: 'My Moments', headerShown: false }} />
      <Tabs.Screen name="create" options={{ title: 'Create a Moment' }} />
      <Tabs.Screen name="reactions" options={{ title: 'Reactions', headerShown: false }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
