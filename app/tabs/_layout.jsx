export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { LinearGradient } from '@/components/custom/LinearGradient';
import { useColorScheme } from '@/components/useColorScheme';
import { usePathname } from 'expo-router';

export default function AppLayout() {
  
  const pathname = usePathname();

  const colorMode = useColorScheme();
  const isDark = colorMode === 'dark';

  const gradientColors =
    isDark
      ? ['#166D3B', '#081912'] // darker greens
      : ['#3EB489', '#90EE90']; // lighter greens

  return (
    <Box className="bg-transparent flex-1">

      {/* "Kermit's Tea" Gradient from eggradients.com */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {pathname === '/tabs/Forms' ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
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
