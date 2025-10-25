// Forms.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect, useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { Heading } from '@/components/ui/heading'

// ================================
// Custom Component Imports
// ================================
import RecordDisplay from '@/components/custom/RecordDisplay';

import PlusIcon from '@/assets/icons/Plus';

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getRecords, deleteForm, getForm } from '@/restapi';


// Main Forms List Screen Component

/**
 * Displays a list of forms with options to create, edit, and delete.
 * This screen utilises the REST API to fetch and manage form data.  
 */
export default function FormListScreen() {
  const router = useRouter();
  const colours = useTheme().colors; // Theme colours

  const { id } = useGlobalSearchParams();

  // ===================
  // State Variables
  // ===================

  // List of records from API
  const [records, setRecords] = useState([]);

  const [formName, setFormName] = useState('');

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ===================
  // Use Effects
  // ===================

  useEffect(() => {
    // Fetch records on record length update.
    fetchRecords();
  }, [records.length])

  /**
   * Fetches all records from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchRecords = async () => {
    try {
      setLoading(true);

      // Fetch and Set Records
      const records = await getRecords();
      setRecords(records);

      // Fetch and Set Form Name
      const form = await getForm(id);
      setFormName(form[0].name);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records.');
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

  /**
   * Confirms deletion and removes the form if confirmed.
   * @param {number} id - ID of the form to delete.
   */
  const handleDeleteForm = async (id) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form?\n\n-Doing so will delete all fields and records associated with the form.',
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
              await deleteForm(id); // Delete form from API.
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              fetchForms(); // Refresh list after deletion
            } catch (err) {
              console.error('Failed to delete form:', err);
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
    
      {/* Show message if no forms exist */}
      {records.length === 0 ? (
        <Center className="flex-1 px-4 mt-8">
          <Text 
            className="text-lg text-center"
            style={{ color: colours.text, opacity: 0.6 }}
          >
            No records yet. Created records will appear here!
          </Text>
        </Center>
      ) : (
        <Box className="px-4 pt-4">
          {/* Form Name and Number of Records */}
          <Center className="m-4">
            <Heading>Records for {formName}</Heading>

            <Text>Showing {records.length} records...</Text>
          </Center>

          {/* Render record display list */}
          <FlatList
            data={records}
            renderItem={({ item }) => (
              <RecordDisplay
                record={item}
                colours={colours}
              />
            )}
            keyExtractor={(item, index) => `${item.form_id}-${index}`} // Each Record has unique ID
            className=""
          />
        </Box>
      )}
    </Box>
  );
}
