import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function Tab2() {
  const router = useRouter();

  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">Expo - Tab 1 Test</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Example below to use gluestack-ui components.</Text>
      <EditScreenInfo path="app/(app)/(tabs)/tab1.tsx" />
    
      <Button
        size="md"
        className="bg-primary-500 px-6 py-2 rounded-full"
        onPress={() => {
          router.push('/');
        }}
      >
        <ButtonText>Explore Tab Navigation</ButtonText>
      </Button>

      <Button
        size="md"
        className="bg-primary-500 px-6 py-2 mt-5 rounded-full"
        onPress={() => {
          router.push('/test');
        }}
      >
        <ButtonText>Not Found Test</ButtonText>
      </Button>
    
    </Center>
  );
}
