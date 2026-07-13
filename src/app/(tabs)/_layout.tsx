import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🧾</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
