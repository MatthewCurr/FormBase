import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
// import { Picker } from '@react-native-picker/picker'; // For status dropdown
import PlusIcon from '@/assets/icons/Plus'; // Optional icon for submit
import { useColorScheme } from 'react-native'; // optional dark mode
import { useTheme } from '@react-navigation/native';

import Fontisto from '@expo/vector-icons/Fontisto';

export default function FormBase({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const colorScheme = useColorScheme(); // 'dark' or 'light'
  const colours = useTheme().colors;

  /**
   * Handle input change event and update form state.
   * @param {Event} event - Input change event.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box className="flex-1 m-8 p-4">
      <Center className="mb-4 w-full">
        <TouchableOpacity
          style={{ backgroundColor: colours.card }}
          className="self-start mb-4 p-2 rounded-lg"
          onPress={onCancel}
        >
          <Box className="flex-row items-center px-2 gap-2">
            <Fontisto 
              name="arrow-return-left" 
              size={12} 
              color={colours.text} 
              style={{ marginTop: -2 }} 
            />
            <Text
              style={{ color: colours.text }}
              className="text-sm font-semibold"
            >
              Back
            </Text>
          </Box>
        </TouchableOpacity>

        <Heading className="text-xl mb-6">
          {isEditing ? 'Edit Form' : 'Create New Form'}
        </Heading>
      </Center>

      <Box className="mb-4">
        <Text className="text-sm mb-1 font-semibold dark:text-white">Form Title</Text>
        <TextInput
          value={formData.title}
          onChangeText={handleChange}
          placeholder="Enter Title"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          className="border border-gray-400 rounded-lg p-3 bg-white text-black"
        />
      </Box>

      <Box className="mb-4">
        <Text className="text-sm mb-1 font-semibold dark:text-white">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={handleChange}
          placeholder="Enter Description"
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          className="border border-gray-400 rounded-lg p-3 bg-white text-black"
          multiline
          numberOfLines={4}
        />
      </Box>

      <Divider className="mt-4 mb-8" />

      {/* Action Buttons */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          onPress={onSubmit}
          style={{ backgroundColor: colours.card }}
          className="flex-1 flex-row items-center justify-center p-4 rounded-lg"
        >
          <PlusIcon size={20} color={colours.text} />
          <Text 
            className="text-white font-semibold ml-2"
            style={{ color: colours.text }}
          >
            {isEditing ? 'Update Form' : 'Create Form'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 items-center justify-center p-4 rounded-lg bg-gray-400"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </Box>
  );
}