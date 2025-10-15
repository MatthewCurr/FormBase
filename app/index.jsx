import React from 'react';
import Gradient from '@/assets/icons/Gradient';
import { Box } from '@/components/ui/box';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { LinearGradient } from '@/components/custom/LinearGradient';
import FileStack from '@/assets/icons/FileStack';

import { useColorScheme } from '@/components/useColorScheme';

// const FeatureCard = ({ iconSvg: IconSvg, name, desc }) => {
//   return (
//     <Box
//       className="flex-column md:flex-1 m-2 p-4 rounded-lg bg-background-0/40"
//       key={name}
//     >
//       <Box className="items-center flex flex-row">
//         <Icon as={IconSvg}/>
//         <Text className="font-medium ml-2 text-xl">{name}</Text>
//       </Box>
//       <Text className="mt-2">{desc}</Text>
//     </Box>
//   );
// };

export default function Home() {
  const router = useRouter();

  const colorMode = useColorScheme();
  const isDark = colorMode === 'dark';

  // Invert main and secondary colors based on dark mode
  const mainColor = isDark ? '#fff' : '#000';
  const secondaryColor = isDark ? '#d1d5db' : '#6b7280';

  return (
    <Box className="flex-1 bg-background-500 h-[100vh]">

      {/* "Kermit's Tea" Gradient from eggradients.com */}
      <LinearGradient
        colors={['#3EB489', '#90EE90']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
          
          <Box className="flex-1 justify-center items-center mb-64 w-[300px] lg:h-[160px] lg:w-[400px]">
            {/* SVG FileStack component */}
            <FileStack color={mainColor} secondaryColor={secondaryColor} />
            <Text className="dark:text-white  text-4xl font-semibold text-black">FormBase</Text>
            <Text className="dark:text-white text-lg font-medium mt-2 text-black">
                Custom Forms at a click of a button!
            </Text>

            {/* Get Started Button */}
            <Button
              size="lg"
              className="bg-primary-500 px-6 py-2 rounded-full mt-10 w-full"
              onPress={() => {
                router.push('/tabs/tab1');
              }}
            >
              <ButtonText>Get Started</ButtonText>
            </Button>
          </Box>

        </Box>
      </ScrollView>
    </Box>
  );
}
