import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#0b0b0c' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#0b0b0c', borderTopColor: '#27272a' },
        tabBarActiveTintColor: '#3b82f6',
      }}>
      <Tabs.Screen name="index" options={{ title: 'Deals' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
