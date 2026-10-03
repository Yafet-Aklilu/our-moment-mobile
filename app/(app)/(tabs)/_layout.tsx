import { Tabs } from 'expo-router';

import { FloatingTabBar } from '@/components/navigation/FloatingTabBar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...(props as object)} />}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.light.background },
        headerTitleStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          color: colors.light.text,
        },
        sceneStyle: { backgroundColor: colors.light.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="moments" options={{ title: 'My moments' }} />
      <Tabs.Screen name="create" options={{ title: 'Create a moment' }} />
      <Tabs.Screen name="reactions" options={{ title: 'Reactions' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
