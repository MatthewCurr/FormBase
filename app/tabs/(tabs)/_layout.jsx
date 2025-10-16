import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Drawer } from 'expo-router/drawer';
import { useNavigation } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function DrawerIcon({ name, color }) {
  return <FontAwesome size={18} style={{ marginRight: 8 }} name={name} color={color} />;
}

function TabBarIcon(props) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function DrawerLayout() {

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown:
          route.name === 'Home' // Hide Header on Home Screen
            ? useClientOnlyValue(false, false) 
            : useClientOnlyValue(false, true),
      })}
    >
    </Drawer>
  );
}

