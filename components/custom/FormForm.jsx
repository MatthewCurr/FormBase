// React Native / FormBase / components / custom / FormForm.jsx
// FormForm.jsx - Reusable Form Component

// ================================
// React & React Native Imports
// ================================

import { useState } from 'react';
import {  Alert, View, Text, TextInput, FlatList,
          TouchableOpacity, useColorScheme } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

// ================================
// Location and Image Imports
// ================================
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

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

import PlusIcon from '@/assets/icons/Plus'; // Submit Icon
import Fontisto from '@expo/vector-icons/Fontisto';

// ================================
// Custom Component Imports
// ================================
import HapticButton from '@/components/custom/HapticButton'
import Photo from '@/components/custom/Photo'

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
 * @param {Array} props.fields - Array of objects that describe the fields.
 * @param {Array} props.title - title to display when adding and editing. ['Add Message', 'Edit Message']
 * @param {Array} props.button - message to display on button when adding and editing.
 * @param {ReactElement} children - Child Elements to be inserted below field options.
 *                               
 * Possible Values for fields:
 * @param {string} props.fields[].name - The key in formData corresponding to this field
 * @param {string} props.fields[].label - Label text displayed above the input
 * @param {string} props.fields[].placeholder - Placeholder text inside the input
 * @param {'text'|'multiline'|'dropdown'|'location'|'image'} [props.fields[].type='text'] - Field Type
 * @param {boolean} props.fields[].multiline=false - Whether the input supports multiple lines
 * @param {boolean} props.fields[].disabled=false - Whether the input is read-only/disabled
 * @param {Function} props.fields[].required - If field is required on form
 * @param {boolean} prop.fields[].is_num - Boolean for if field only accepts numeric values
 * @param {Array} props.fields[].options - If type = dropdown, array that stores the options for the dropdown
 *
 * Example of fields:
 * [
 *   { name: 'name', label: 'Name', placeholder: 'Enter your name', type: 'text' },
 *   { name: 'age', label: 'Age', placeholder: 'Enter age', type: 'text', is_num: true },
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
  button = ["Create Form", "Update Form"],
  children
}) {

  const colorScheme = useColorScheme(); // 'dark' or 'light'
  const colours = useTheme().colors; // Theme colours

  // ===================
  // State Variables
  // ===================

  // Dropdown State 
  const [openDropdown, setOpenDropdown] = useState(null);

  // Location State
  const [location, setLocation] = useState(null);

  // Image Picker State
  const [photoState, setPhotoState] = useState({});
  
  const hasPhoto = Boolean(photoState.uri); // Check if photo exists

  /**
   * Handle input change event and update form state.
   * @param {string} field - The field name (key in formData)
   * @param {string} value - The new text value
   */
  const handleChange = (field, is_num, value) => {
    const formValue = is_num ? Number(value) : value
    setFormData({ ...formData, [field]: formValue });
  };

  // Handle submit with haptics feedback
  const handlePressSubmit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validate required fields
    const missingFields = fields
      .filter(field => field.required) // Only check for required fields
      .filter(field => {

        // Check for location fields (objects with latitude/longitude)
        if (field.type === 'location') {
          return !formData[field.name]?.latitude || !formData[field.name]?.longitude;
        }

        // Check for image fields
        if (field.type === 'image') {
          return !hasPhoto;
        }

        if (field.is_num) {
          return !formData[field.name]
        } else {
          // Else check for normal text fields
          return !formData[field.name]?.trim()
        }
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

  /**
   * Function to request location permission and get current location
   * @param {Object} field - The field object from fields array
   */
  const requestLocation = (field) => {

    // Async function to handle location request
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission to access location was denied');

        Alert.alert('Location Error', 'Permission to access location was denied');
        
        return;
      }

      // Get Current Location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords); // Update local location state

      // Update formData with location object
      setFormData({ ...formData, 
        [field.name]: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        }
      });

      // Alert with retrieved location
      Alert.alert('Location Retrieved', `\nLatitude: ${loc.coords.latitude}, Longitude: ${loc.coords.longitude}`);
    })();
  };

  /**
   * Function to handle image picker launch and selection
   * @param {Object} field - The field object from fields array
   */
  async function handlePhotoPress(field) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If user didn't cancel selection
    if (!result.canceled && result.assets && result.assets.length > 0) {

      // Get the source URI of the selected image
      const sourceUri = result.assets[0].uri;

      // Move to document directory for persistent storage if needed
      const destDir = FileSystem.documentDirectory + 'images/';
      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });

      // Get file name from URI
      const fileName = sourceUri.split('/').pop();

      // Destination URI
      const destUri = destDir + fileName;
      
      // Copy the file to the app's document directory
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destUri,
      });
      
      // Update photo state with new URI
      setPhotoState(result.assets[0]);

      // Update form data with image URI
      setFormData({ ...formData, [field.name]: destUri });
    }
  }

  // Function to remove the selected photo
  async function handlePhotoRemove() {
      setPhotoState({});
  }


  /**
   * Function to render each field based on its type
   * @param {Object} - The item object containing field details
   */
  const renderField = ({ item: field}) => {

    // Check if options is an array
    const optionsArray = Array.isArray(field.options) ? field.options : [];

    // ===================
    // Render Field Based on Type
    // ===================
    return (
      <Box key={field.name} className="">
        
        {field.type === 'dropdown' && field.options ? ( // Render Picker for Dropdown
          <Box key={field.name} className="mb-4">
            <Text className="text-base mb-1 font-semibold" style={{ color: colours.text }}>{field.label}</Text>
            <DropDownPicker
              open={openDropdown === field.name}
              value={formData[field.name]}
              items={optionsArray.map((option) => ({
                label: option,
                value: option,
              }))}
              setOpen={(isOpen) =>
                setOpenDropdown(isOpen ? field.name : null)
              }
              setValue={(callback) => {
                const value = callback(formData[field.name]);
                handleChange(field.name, field.is_num, value);
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

        ) : field.type === 'image' ? ( // If Image Picker
          <>
            <Text className="text-base mb-1 font-semibold" style={{ color: colours.text }}>{field.label}</Text>

            {/* Photo Component to display image */}
            <Photo 
              hasPhoto={hasPhoto}
              photoState={photoState}
            />

            {/* Image Upload Button */}
            <HapticButton 
              onPress={() => handlePhotoPress(field)}
              className="mt-2 flex-1 p-3 rounded-lg items-center"
              style={{ backgroundColor: colours.primary }}
            >
              {hasPhoto ? (
                <Text 
                  style={{ color: '#fff' }} 
                  className="font-semibold"
                >
                  Change Image
                </Text>
              ) : (
                <Text 
                  style={{ color: '#fff' }}
                  className="font-semibold"
                >
                  Upload Image
                </Text>
              )}
            </HapticButton>

            {/* Show Remove Image Button if photo exists */}
            {hasPhoto && (
              <HapticButton 
                onPress={handlePhotoRemove}
                className="mt-2 flex-1 p-3 rounded-lg items-center"
                style={{ backgroundColor: colours.primary }}
              >
                <Text 
                  style={{ color: '#fff' }}
                  className="font-semibold"
                >
                  Remove Image
                </Text>
            </HapticButton> 
            )}
          </>        
        ) : field.type === 'location' ? ( // If Location
          <Box key={field.name} className="mb-4">
            <Text className="text-base mb-1 font-semibold" style={{ color: colours.text }}>{field.label}</Text>
            
            {/* Request Location */}
            <HapticButton
              className="flex-1 p-5 rounded-lg items-center"
              style={{ backgroundColor: colours.primary }}
              onPress={() => requestLocation(field)}
            >
              <Text style={{ color: '#fff' }} className="font-semibold">
                Request Location
              </Text>
            </HapticButton>

            {location && (
                // Location Container
                <Box
                  className="mt-3 p-4 rounded-lg"
                  style={{ backgroundColor: colours.card, borderColor: colours.border, borderWidth: 1 }}
                >

                  <Text className="mb-3 text-sm font-semibold" style={{ color: colours.text }}>
                    CURRENT LOCATION
                  </Text>

                  {/* Latitude and Longitude  */}
                  <Box className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm" style={{ color: colours.text, opacity: 0.8 }}>
                      Latitude
                    </Text>
                    <Text className="text-base font-semibold" style={{ color: colours.text }}>
                      {location.latitude.toFixed(6)}°
                    </Text>
                  </Box>
                  <Box className="flex-row items-center justify-between">
                    <Text className="text-sm" style={{ color: colours.text, opacity: 0.8 }}>
                      Longitude
                    </Text>
                    <Text className="text-base font-semibold" style={{ color: colours.text }}>
                      {location.longitude.toFixed(6)}°
                    </Text>
                  </Box>

                </Box>
              )}
          </Box>
        
      ) : ( // Else if Text or Multiline render TextInput
          <Box key={field.name} className="mb-4">
            <Text className="text-base mb-1 font-semibold" style={{ color: colours.text }}>{field.label}</Text>
            <TextInput
              value={formData[field.name]}
              onChangeText={(value) => handleChange(field.name, field.is_num, value)}
              placeholder={field.placeholder}
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              multiline={field.multiline || false}
              keyboardType={field.is_num === true ? 'numeric' : 'default'}
              className="border border-gray-400 rounded-lg p-3 bg-white text-black"
            />
          </Box>
        )}
      </Box>
    )
  }

  /* Main Content Render */
  return (
    <Box className="flex-1 m-6">
      {/* Back Button and Form Title */}
      <Center className="w-full px-4 py-2">
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

        <Heading className="text-xl mb-2" style={{ color: colours.text }}>
          {isEditing ? title[1] : title[0]}
        </Heading>
      </Center>

      {/* List All Fields passed into component */}
      <FlatList
        data={fields}
        keyExtractor={(item) => item.name}
        renderItem={renderField}
        ListFooterComponent={
          <>
            {/* Child Elements passed into Component */}
            {children && (
            <Box>
              {children}
            </Box>
            )}

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
          </>
        }
        contentContainerStyle={{
          paddingHorizontal: 16, // adds space from screen edges
          paddingVertical: 12,   // adds space top and bottom
        }}
      />
      
    </Box>
  );
}