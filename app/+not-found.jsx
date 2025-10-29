// React Native / FormBase / app / +not-found.jsx
// +not-found.jsx - Screen displayed for undefined routes

// ================================
// Navigation Imports
// ================================
import { Link, Stack } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';

/**
 * Not Found Screen Component
 * Displayed when a user navigates to an undefined route.
 */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Center className="flex-1">
        <Text className="text-secondary-800">This screen doesn't exist.</Text>
        <Link href="/" style={{ marginTop: 10 }}>
          <Text className="text-primary-500">Go to home screen!</Text>
        </Link>
      </Center>
    </>
  );
}
