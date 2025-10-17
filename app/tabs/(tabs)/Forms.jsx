import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import PlusIcon from '@/assets/icons/Plus';
import * as Haptics from 'expo-haptics';

export default function FormListScreen() {
  const router = useRouter();

  const handleFormSubmit = async () => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navigate to the form creation screen
    //router.push('/forms/create');
  }

  return (
    <ScrollView className="flex-1">

      <Center className="">
        <TouchableOpacity
          className="p-4 bg-red-400 m-4 w-[250px] justify-center gap-2 flex-row items-center rounded-xl"
          onPress={handleFormSubmit}
        >
          <PlusIcon size={16} color="#fff" />
          <Text className="mr-2">   
            Add New Form
          </Text>
        </TouchableOpacity>
      </Center>
      

      {/* <FlatList
        data={formData}
        renderItem={renderFormItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      /> */}
    </ScrollView>
  );
}
