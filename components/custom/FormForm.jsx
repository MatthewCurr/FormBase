import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
// import { Picker } from '@react-native-picker/picker'; // For status dropdown
import PlusIcon from '@/assets/icons/Plus'; // Optional icon for submit
import { useColorScheme } from 'react-native'; // optional dark mode

export default function FormBase({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const colorScheme = useColorScheme(); // 'dark' or 'light'


  

  /**
   * Handle input change event and update form state.
   * @param {Event} event - Input change event.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView className="flex-1 bg-background-500 w-full">
      <Center className="mb-4 w-full">
        <TouchableOpacity
          className="self-start mb-4 p-2 bg-gray-300 rounded-lg"
          onPress={onCancel}
        >
          <Text className="text-sm font-semibold">
            Back
          </Text>
        </TouchableOpacity>

        <Heading className="text-xl mb-6">
          {isEditing ? 'Edit Form' : 'Create New Form'}
        </Heading>
      </Center>

      <Box className="mb-4">
        <Text className="text-sm mb-1 font-semibold">Form Title</Text>
        <TextInput
          value={formData.title}
          onChangeText={handleChange}
          placeholder="Enter Title"
          className="border border-gray-400 rounded-lg p-3 bg-white text-black"
        />
      </Box>

      <Box className="mb-4">
        <Text className="text-sm mb-1 font-semibold">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={handleChange}
          placeholder="Enter Description"
          className="border border-gray-400 rounded-lg p-3 bg-white text-black"
          multiline
          numberOfLines={4}
        />
      </Box>



      {/* Action Buttons */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          onPress={onSubmit}
          className="flex-1 flex-row items-center justify-center p-4rounded-lg"
        >
          <PlusIcon size={20} color="#fff" />
          <Text className="text-white font-semibold ml-2">
            {isEditing ? 'Update Form' : 'Create Form'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 items-center justify-center p-4 rounded-lg"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}