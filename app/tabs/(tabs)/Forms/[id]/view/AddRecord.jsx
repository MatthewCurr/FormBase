// AddRecord.jsx - Add Record to Form Screen

// ================================
// React & React Native Imports
// ================================
import { useState, useCallback } from 'react';
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

/**
 * Add a new record to the form.
 * @returns {JSX.Element}
 */
export default function AddRecord() {
  const router = useRouter(); // Navigation router
  const colours = useTheme().colors; // Theme colours

  const { id } = useLocalSearchParams(); // Form ID

  // ===================
  // State Variables
  // ===================

  // List of fields from API
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({});

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Title and Button Text
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

  // Map fetched fields to form structure, suitable for FormBase component
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

  // Navigate to EditField screen to add fields
  const handleEditPress = () => {
    router.push(`tabs/Forms/${id}/edit/EditField`)
  }

  // Handle Form Submission
  const handleSubmit = async () => {
    try {
      // Add form_id foreign key into the API payload
      const payload = {
        form_id: id,
        values: { ...formData } // Add fields as JSONB field
      };

      // Create the Field Data in the API
      await createRecord(payload);

      // Provide haptic feedback
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
        <Center className="flex-1 px-4 -mt-8 gap-1">
          <Text 
            className="text-lg text-center font-semibold"
            style={{ color: colours.text, opacity: 1 }}
          >
            No Fields Yet.
          </Text>
          <Text 
            className="text-lg text-center font-semibold"
            style={{ color: colours.text, opacity: 0.8 }}
          >Add a field to this form!
          </Text>
          <HapticButton
            className="px-10 py-3 mt-8 rounded-xl items-center"
            style={{ backgroundColor: colours.card, borderWidth: 2, borderColor: colours.primary }}
            onPress={() => handleEditPress()}
          >
            <Text style={{ color: colours.text }} className="text-xl font-semibold">
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