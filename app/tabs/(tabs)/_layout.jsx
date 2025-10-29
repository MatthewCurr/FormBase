// _layout.jsx - Layout for Drawer Navigation

// ================================
// Navigation Imports
// ================================
import { Drawer } from 'expo-router/drawer';
import { useLocalSearchParams } from 'expo-router';

// ================================
// Custom Component & Icon Imports
// ================================
import FontAwesome from '@expo/vector-icons/FontAwesome';

// ================================
// Custom Hooks Imports
// ================================
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';

/** 
 * Layout component for Drawer Navigation.
 */
export default function DrawerLayout() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const isDark = colorScheme === 'dark'; // Boolean for dark mode

  // ===================
  // Render
  // ===================
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown:
          route.name === 'Home' // Hide Header on Home Screen
            ? useClientOnlyValue(false, false) 
            : useClientOnlyValue(false, true),
        drawerItemStyle: {
          display: route.name.includes('[') ? 'none' : 'flex',
        },
        drawerActiveTintColor: isDark ? '#3EB489' : '#059669',
        drawerInactiveTintColor: isDark ? '#AAAAAA' : '#555555',
        drawerLabelStyle: { fontSize: 20 },
      })}
    >
      {/* Drawer Screens */}
      <Drawer.Screen name="Home" options={{ title: 'Home', drawerLabel: 'Home' }} />
      <Drawer.Screen name="Forms/index" options={{ title: 'Forms', drawerLabel: 'Forms' }} />
      <Drawer.Screen name="Forms/AddForm" options={{ title: `Forms`, drawerLabel: 'Create Form'}} />
      <Drawer.Screen name="About" options={{ title: 'About', drawerLabel: 'About' }} />
      <Drawer.Screen name="Forms/[id]/view" options={{ title: `Forms` }} />
      <Drawer.Screen name="Forms/[id]/edit" options={{ title: `Forms` }} />
    </Drawer>
  );
}

