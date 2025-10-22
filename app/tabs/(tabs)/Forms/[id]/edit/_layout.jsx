import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HapticButton from '@/components/custom/HapticButton'

import { useTheme } from '@react-navigation/native';

export default function EditTabsLayout() {
  const router = useRouter();
  const colours = useTheme().colors; 

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
      <Tabs.Screen name="Edit" options={{ title: 'Edit Form'}}/>
      <Tabs.Screen name="EditField" options={{ title: 'Add Fields' }} />
    </Tabs>
  );
}