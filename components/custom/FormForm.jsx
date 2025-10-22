// ================================
// React & React Native Imports
// ================================

import {  Alert, View, Text, TextInput,
          TouchableOpacity, useColorScheme } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker'
import { useState } from 'react'

// ================================
// Navigation and Theme Imports
// ================================

import { useTheme } from '@react-navigation/native';

// ================================
// UI Component Imports
// ================================

import { Divider } from '@/components/ui/divider';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import PlusIcon from '@/assets/icons/Plus'; // Optional icon for submit
import Fontisto from '@expo/vector-icons/Fontisto';

// ================================
// Haptics Imports
// ================================
import * as Haptics from 'expo-haptics';


/**
 * Reusable Form Component able to display different fields. 
 * 
 * @param {Object} props
 * @param {Object} props.formData - object containing the current form values
 * @param {Function} props.setFormData - function to update formData
 * @param {Function} props.onSubmit - Called when the Submit button is pressed.
 * @param {Function} props.onCancel - Called when the Cancel button is pressed.
 * @param {boolean} props.isEditing - Whether the form is in editing mode.
 * @param {Array} props.fields - Array of objects that describe the fields,
 * @param {Array} props.title - title to display when adding and editing. ['Add Message', 'Edit Message']
 * @param {Array} props.button - message to display on button when adding and editing.
 *                               
 * Possible Values for fields:
 * @param {string} props.fields[].name - The key in formData corresponding to this field
 * @param {string} props.fields[].label - Label text displayed above the input
 * @param {string} props.fields[].placeholder - Placeholder text inside the input
 * @param {'text'|'multiline'|'dropdown'|'location'|'image'} [props.fields[].type='text'] - Field Type
 * @param {boolean} props.fields[].multiline=false - Whether the input supports multiple lines
 * @param {boolean} props.fields[].disabled=false - Whether the input is read-only/disabled
 * @param {Array<string>} props.fields[].options - For dropdown/select fields: the possible options
 * @param {Function} props.fields[].required - If field is required on form
 * @param {boolean} prop.fields[].is_num - Boolean for if field only accepts numeric values
 * @param {Array} props.fields[].options - If type = dropdown, array that stores the options for the dropdown
 *
 * Example of fields:
 * [
 *   { name: 'name', label: 'Name', placeholder: 'Enter your name', type: 'text' },
 *   { name: 'age', label: 'Age', placeholder: 'Enter age', type: 'number' },
 * ]
 */
export default function FormBase({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  fields = [],
  title = ["Create New Form", "Edit Form"],
  button = ["Create Form", "Update Form"]
}) {

  const colorScheme = useColorScheme(); // 'dark' or 'light'
  const colours = useTheme().colors;

  const [openDropdown, setOpenDropdown] = useState(null);

  /**
   * Handle input change event and update form state.
   * @param {string} field - The field name (key in formData)
   * @param {string} value - The new text value
   */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle submit with haptics feedback
  const handlePressSubmit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const missingFields = fields
      .filter(field => field.required) // Only check for required fields
      .filter(field => {
        return !formData[field.name]?.trim()
      });

    // Alert for required fields not filled
    if (missingFields.length > 0) {
      // Join Missing Field Names
      const fieldNames = missingFields.map(f => f.label).join(', ');
      Alert.alert('Missing Required Fields', `Please fill in the following required fields: ${fieldNames}`)
      return;
    }

    // Call onSubmit Callback passed in component.
    onSubmit();
  }

  return (
    <Box className="flex-1 m-8 p-4">
      {/* Back Button and Form Title */}
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
          {isEditing ? title[1] : title[0]}
        </Heading>
      </Center>

      {fields.map((field) => 
        field.type === 'dropdown' && field.options ? ( // Render Picker for Dropdown
          <Box key={field.name} className="mb-4">
            <Text className="text-sm mb-1 font-semibold dark:text-white">{field.label}</Text>
            <DropDownPicker
              open={openDropdown === field.name}
              value={formData[field.name]}
              items={field.options.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              setOpen={(isOpen) =>
                setOpenDropdown(isOpen ? field.name : null)
              }
              setValue={(callback) => {
                const value = callback(formData[field.name]);
                handleChange(field.name, value);
              }}
              placeholder={field.placeholder || 'Select an option'}
              style={{
                borderColor: '#9CA3AF',
                backgroundColor: '#fff',
              }}
              dropDownContainerStyle={{
                borderColor: '#9CA3AF',
                backgroundColor: '#fff',
              }}
              
            />
          </Box>
        ) : ( // Else if Text or Multiline render TextInput
          <Box key={field.name} className="mb-4">
            <Text className="text-sm mb-1 font-semibold dark:text-white">{field.label}</Text>
            <TextInput
              value={formData[field.name]}
              onChangeText={(value) => handleChange(field.name, value)}
              placeholder={field.placeholder}
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              multiline={field.multiline || false}
              keyboardType={field.is_num === true ? 'numeric' : 'default'}
              className="border border-gray-400 rounded-lg p-3 bg-white text-black"
            />
          </Box>
        )
      )}

      {/* List All Fields passed into component */}
      

      <Divider className="mt-4 mb-8" />

      {/* Action Buttons */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          onPress={() => handlePressSubmit()}
          style={{ backgroundColor: colours.card }}
          className="flex-1 flex-row items-center justify-center p-4 rounded-lg"
        >
          <PlusIcon size={20} color={colours.text} />
          <Text 
            className="text-white font-semibold ml-2"
            style={{ color: colours.text }}
          >
            {isEditing ? button[1] : button[0]}
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