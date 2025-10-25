// AddRecord.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';

// ================================
// Custom Component Imports
// ================================
import FormItem from '@/components/custom/FormItem';
import HapticButton from '@/components/custom/HapticButton'

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getFields, deleteField } from '@/restapi';


export default function AddRecord() {
  const router = useRouter();
  const colours = useTheme().colors; // Theme colours

  const { id } = useLocalSearchParams();

  // ===================
  // State Variables
  // ===================

  // List of fields from API
  const [fields, setFields] = useState([]);

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================
  // Use Effects
  // ===================

  useEffect(() => {
    // Fetch fields on component mount.
    fetchFields();
  }, [id]);

  /**
   * Fetches all fields from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchFields = async () => {
    try {
      setLoading(true);
      const fields = await getFields(id);
      console.log(`\n\n\n\n`)
      console.log('Fetched forms:', fields);
      setFields(fields);
    } catch (err) {
      console.error('Error fetching fields:', err);
      setError('Failed to load fields.');
      setLoading(false);
    } finally {
      setLoading(false);  
    }
  };


  // ===================
  // Form Handlers
  // ===================

  /**
   * Populates the form fields for editing and toggles edit mode.
   * @param {Object} item - The form item to edit.
   */
  const handleEditForm = (item) => {
    router.push(`tabs/Forms/${item.id}/edit`)
  }

  /**
   * Brings up empty form to enter. 
   */
  const handleAddForm = () => {
    router.push(`tabs/Forms/AddForm`)
  }

  const handleEditPress = () => {
    router.push(`tabs/Forms/${id}/edit/EditField`)
  }

  /**
   * Confirms deletion and removes the form if confirmed.
   * @param {number} id - ID of the form to delete.
   */
  const handleDeleteForm = async (id) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this field?',
      [
        {
          text: 'Cancel',
          style: 'cancel', // React Native Cancel Style
        },
        {
          text: 'Delete',
          style: 'destructive', // IOS Delete Style
          onPress: async () => {
            try {
              await deleteField(id); // Delete form from API.
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              fetchFields(); // Refresh list after deletion
            } catch (err) {
              console.error('Failed to delete field:', err);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  /**
   * Handles viewing a form's fields and records.
   * @param {*} item - The form item to view.
   */
  const handleViewForm = (item) => {
    const path = `tabs/Forms/${item.id}/view/AddRecord`
    router.push(path); // Navigate to edit page.
  };


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
        <FlatList
          data={fields}
          renderItem={({ item }) => (
            <FormItem
              item={item}
              onEdit={handleEditForm}
              onView={handleViewForm}
              onDelete={handleDeleteForm}
              colours={colours}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </Box>
  );
}