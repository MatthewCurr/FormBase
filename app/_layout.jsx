// _layout.jsx - Root Layout Component

// ================================
// React & Navigation Imports
// ================================
import { Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

// ================================
// UI Component & Theme Imports
// ================================
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css'; // Global styles
import { ThemeProvider } from '@react-navigation/native';
import { LightThemeCustom, DarkThemeCustom } from '@/theme';

// ================================
// Icon and Font Imports
// ================================
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';

// ================================
// Export Error Boundary
// ================================
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

// ================================
// Root Layout Component - Renders Navigation and Theme Providers
// ================================
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // ================================
  // Handle Loading and Errors
  // ================================

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

// ================================
// Root Layout Navigation Component
// ================================
function RootLayoutNav() {
  const [colorMode, setColorMode] = useState('light'); // 'light' or 'dark'

  // ===============================
  // Render
  // ===============================
  return (
    // Gluestack UI Provider for theming
    <GluestackUIProvider mode={colorMode}>
      <ThemeProvider value={colorMode === 'dark' ? DarkThemeCustom : LightThemeCustom}>
        <Slot />
          {/* Dark/Light Mode Toggle FAB */}
          <Fab
            onPress={() =>
              setColorMode(colorMode === 'dark' ? 'light' : 'dark')
            }
            className="absolute top-12 right-3"
            size="lg"
            width={40}
            height={40}
          >
            <FabIcon as={colorMode === 'dark' ? MoonIcon : SunIcon} />
          </Fab>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
