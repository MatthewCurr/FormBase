// _layout.jsx - Layout for Tab Navigation

// ================================
// React & Navigation Imports
// ================================
import { ScrollView } from 'react-native';
import { usePathname, Stack } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { useColorScheme } from '@/components/useColorScheme';

// ================================
// Custom Component Imports
// ================================
import { LinearGradient } from '@/components/custom/LinearGradient';


// ================================
// Error Boundary Export
// ================================
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


// ================================
// Layout Component
// ================================
export default function AppLayout() {
  
  const pathname = usePathname(); // Current path

  const colorMode = useColorScheme(); // 'light' or 'dark'
  const isDark = colorMode === 'dark'; // Boolean for dark mode

  // ===================
  // Gradient Colors
  // ===================

  const gradientColors =
    isDark
      ? ['#166D3B', '#081912'] // darker greens
      : ['#3EB489', '#90EE90']; // lighter greens

  // ===================
  // Render
  // ===================
  return (
    <Box className="bg-transparent flex-1">

      {/* "Kermit's Tea" Gradient from eggradients.com */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Conditional Rendering Based on Pathname */}
      {(pathname === '/tabs/Forms' || pathname.includes('/tabs/Forms/')) ? ( // For Forms routes
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : ( // For non-Forms routes
        <ScrollView
          style={{ height: '100%', borderColor: 'black'}}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ScrollView>
      )}
    </Box>
  );
}
