import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Drawer } from 'expo-router/drawer';
import { DarkTheme, useNavigation } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';

function DrawerIcon({ name, color }) {
  return <FontAwesome size={18} style={{ marginRight: 8 }} name={name} color={color} />;
}

export default function DrawerLayout() {

  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const isDark = colorScheme === 'dark';

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown:
          route.name === 'Home' // Hide Header on Home Screen
            ? useClientOnlyValue(false, false) 
            : useClientOnlyValue(false, true),
        drawerActiveTintColor: isDark ? '#3EB489' : '#059669',
        drawerInactiveTintColor: isDark ? '#AAAAAA' : '#555555',
        drawerLabelStyle: { fontSize: 20 },
      })}
    >
      <Drawer.Screen name="Home" options={{ title: 'Home', drawerLabel: 'Home' }} />
      <Drawer.Screen name="Forms/index" options={{ title: 'Forms', drawerLabel: 'Forms' }} />
      <Drawer.Screen name="About" options={{ title: 'About', drawerLabel: 'About' }} />
    </Drawer>
  );
}

