import React from 'react';
import { Box } from '@/components/ui/box';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { LinearGradient } from '@/components/custom/LinearGradient';
import FileStack from '@/assets/icons/FileStack';
import { useTheme } from '@react-navigation/native';

import { useColorScheme } from '@/components/useColorScheme';

export default function Home() {
  const router = useRouter();

  const colours = useTheme().colors; 
  const colorMode = useColorScheme();
  const isDark = colorMode === 'dark';

  // Invert main and secondary colors based on dark mode
  const mainColor = isDark ? '#5B5551' : '#EBEAE9';
  const secondaryColor = isDark ? '#272423' : '#C7C4BF';

  const gradientColors =
    isDark
      ? ['#166D3B', '#081912'] // darker greens
      : ['#3EB489', '#90EE90']; // lighter greens

  return (
    <Box className="flex-1 bg-transparent">

      {/* "Kermit's Tea" Gradient from eggradients.com */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100}}
      >
        <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
          <Box className="flex-1 justify-center items-center w-[300px] lg:h-[160px] lg:w-[400px]">
            {/* SVG FileStack component */}
            <FileStack color={mainColor} secondaryColor={secondaryColor} />
            <Text className="dark:text-white  text-4xl font-semibold text-black">FormBase</Text>
            <Text className="dark:text-white text-lg font-medium mt-2 text-black">
                Custom Forms at a click of a button!
            </Text>

            {/* Get Started Button */}
            <Button
              size="xl"
              style={{ backgroundColor: colours.card }}
              className=" px-6 py-2 rounded-full mt-10 w-full"
              onPress={() => {
                router.push('/tabs/Forms');
              }}
            >
              <ButtonText style={{ color: colours.text }}>Get Started</ButtonText>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
