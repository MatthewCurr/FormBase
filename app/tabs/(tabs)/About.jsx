import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import FileStack from '@/assets/icons/FileStack';
import { useColorScheme } from '@/components/useColorScheme';

export default function About() {

  const colorMode = useColorScheme();
  const isDark = colorMode === 'dark';
  
  // Filestack Colours for Dark and Light Mode
  const mainColor = isDark ? '#EBEAE9' : '#5B5551';
  const secondaryColor = isDark ? '#272423' : '#C7C4BF';

  return (
    <Box className="p-10 items-start">
      {/* Icon and Title */}
      <Box className="items-center p-4 -mt-6">
        <Box className="">
          <FileStack color={mainColor} secondaryColor={secondaryColor}/>
        </Box>
        <Heading className="text-xl">FormBase</Heading>
      </Box>

      {/* Description Text */}
      <Text className=" text-lg">
        The modern way to create custom forms. 
        FormBase combines powerful features with an intuitive interface, 
        letting you build professional forms in minutes.
      </Text>

      {/* Divider */}
      <Divider className="my-[30px] w-[80%]" />

      {/* Section Heading */}
      <Heading className="text-2xl mb-4">What we Offer</Heading>
      
      {/* Features List */}
      <Box className="flex flex-col space-y-3">
        <Text className="text-base text-left">
          • <Text className="font-semibold">Dynamic Form Creation:</Text> Create forms that adapt to your needs.
        </Text>
        <Text className="text-base text-left">
          • <Text className="font-semibold">In-Built Form Filter:</Text> Easily filter and manage form responses.
        </Text>
        <Text className="text-base text-left">
          • <Text className="font-semibold">Map:</Text> Easily visualize location data.
        </Text>
      </Box>
    </Box>
  );
}
