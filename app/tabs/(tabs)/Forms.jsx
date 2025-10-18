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
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';

import { useState } from 'react';


export default function FormListScreen() {
  const router = useRouter();

  const colours = useTheme().colors; 

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({ name: '', description: '' });

  // ===================
  // Form Handlers
  // ===================
  const handleFormSubmit = async () => {
    try {
      let newForm;
      if (isEditing) {
        // Update existing form logic
      } else {
        // Create new form logic
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Reset form state

    } catch (err) {
      console.error(err);
      setError('Failed to save form.');
    }
  };

  return (
    <ScrollView className="flex-1">

      {showForm &&
        <FormBase 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={isEditing}
        />
      }

      {!showForm &&

        <Center className="">
          <TouchableOpacity
            style={{ backgroundColor: colours.card }}
            className="p-4 m-4 w-[250px] justify-center gap-2 flex-row items-center rounded-xl"
            onPress={() => setShowForm(true)}
          >
            <PlusIcon size={16} color={colours.text} />
            <Text className="mr-2">   
              Add New Form
            </Text>
          </TouchableOpacity>
          <Box className="w-full h-px mb-4" style={{ backgroundColor: colours.border }} />

        </Center>
      }
        

        {/* <FlatList
          data={formData}
          renderItem={renderFormItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        /> */}
    </ScrollView>
  );
}
