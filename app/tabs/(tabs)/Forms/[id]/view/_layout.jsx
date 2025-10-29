// _layout.jsx - Layout for Viewing Form Details

// ================================
// React & Navigation Imports
// ================================
import { Tabs, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

// ================================
// Custom Component & Icon Imports
// ================================
import { Ionicons } from '@expo/vector-icons';
import HapticButton from '@/components/custom/HapticButton'

/**
 * Layout component for Viewing Form Tabs.
 */
export default function ViewTabsLayout() {
  const router = useRouter(); // Navigation router
  const colours = useTheme().colors; // Theme colours

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <HapticButton
            onPress={() => router.push('/tabs/Forms')} // navigate to forms
            style={{ paddingHorizontal: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={colours.primary} />
          </HapticButton>
        ),
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen name="AddRecord" options={{ title: 'Add Record'}}/>
      <Tabs.Screen name="Map" options={{ title: 'Map' }} />
      <Tabs.Screen name="Records" options={{ title: 'Records'}}/>
    </Tabs>
  );
}