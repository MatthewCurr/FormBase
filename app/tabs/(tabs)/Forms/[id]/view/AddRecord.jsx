// AddRecord.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useRouter } from 'expo-router';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';

// ================================
// Custom Component Imports
// ================================
import FormBase from '@/components/custom/FormForm'
import HapticButton from '@/components/custom/HapticButton'

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getFields, deleteField, createRecord } from '@/restapi';


export default function AddRecord() {
  const router = useRouter();
  const colours = useTheme().colors; // Theme colours

  const { id } = useLocalSearchParams();

  // ===================
  // State Variables
  // ===================

  // List of fields from API
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({});

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const titles = ["Add a Record"]
  const buttons = ["Add Record"]

  // ===================
  // Use Effects
  // ===================

  useFocusEffect(
    useCallback(() => {
      // Fetch fields on component focus.
      fetchFields();
    }, [id])
  );

  /**
   * Fetches all fields from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchFields = async () => {
    try {
      setLoading(true);
      const fields = await getFields(id);

      // Map Fetched Fields to Form Data Structure
      const formFields = mapFetchedToForm(fields)
      // Set Fields for use in rendering.
      setFields(formFields);
    } catch (err) {
      console.error('Error fetching fields:', err);
      setError('Failed to load fields.');
      setLoading(false);
    } finally {
      setLoading(false);  
    }
  };

  function mapFetchedToForm(fields) {
    return fields.map((f) => ({
      name: f.name,
      label: f.name,
      placeholder: `Enter ${f.name}`,
      required: f.required,
      multiline: f.field_type.toLowerCase() === "multiline" ? true : false,
      is_num: f.is_num,
      type: f.field_type.toLowerCase(),
      options: f.options
    }));
  }


  // ===================
  // Form Handlers
  // ===================

  const handleEditPress = () => {
    router.push(`tabs/Forms/${id}/edit/EditField`)
  }

  const handleSubmit = async () => {

    try {

      // Add form_id foreign key into the API payload
      const payload = {
        form_id: id,
        values: { ...formData } // Add fields as JSONB field
      };

      // Create the Field Data in the API
      console.log('Form Data is', payload);
      await createRecord(payload);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Reset Form Data
      setFormData({});

    } catch (err) {
      console.error(err);
      Alert.alert("Submission Error",`Failed to add record\n${err}`);
    }
  }

  // ===================
  // UI Rendering
  // ===================
  return (
    <Box className="flex-1">

      {/* Show message if no fields exist */}
      {fields.length === 0 ? (
        <Center className="flex-1 px-4 -mt-8 gap-4">
          <Text 
            className="text-lg text-center font-semibold"
            style={{ color: colours.text, opacity: 0.6 }}
          >
            No fields yet. Add a field to this form!
          </Text>
          <HapticButton
            className="px-10 m-2 rounded-lg items-center"
            style={{ backgroundColor: colours.primary }}
            onPress={() => handleEditPress()}
          >
            <Text style={{ color: '#fff' }} className="text-xl font-semibold">
              Add Fields
            </Text>
          </HapticButton>
        </Center>
      ) : (
        // Render field list
        <FormBase
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/tabs/Forms')}
          isEditing={false}
          fields={fields}
          title={titles}
          button={buttons}
        />
      )}
    </Box>
  );
}