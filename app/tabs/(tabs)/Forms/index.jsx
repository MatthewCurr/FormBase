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
import { useTheme, useFocusEffect } from '@react-navigation/native';

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

import PlusIcon from '@/assets/icons/Plus';

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getForms, deleteForm } from '@/restapi';


// Main Forms List Screen Component

/**
 * Displays a list of forms with options to create, edit, and delete.
 * This screen utilises the REST API to fetch and manage form data.  
 */
export default function FormListScreen() {
  const router = useRouter();
  const colours = useTheme().colors; // Theme colours

  // ===================
  // State Variables
  // ===================

  // List of forms from API
  const [forms, setForms] = useState([]);

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ===================
  // Use Effects
  // ===================

  useFocusEffect(
    useCallback(() => {
      fetchForms(); // fetch whenever screen is focused.
    }, [])
  );

  /**
   * Fetches all forms from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchForms = async () => {
    try {
      setLoading(true);
      const forms = await getForms();
      console.log('Fetched forms:', forms);
      setForms(forms);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Failed to load forms.');
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
      {/* Add Form Button */}
      <Center>
        <TouchableOpacity
          style={{ backgroundColor: colours.card }}
          className="p-4 m-4 w-[250px] justify-center gap-2 flex-row items-center rounded-xl"
          onPress={() => handleAddForm()}
        >
          <PlusIcon size={16} color={colours.text} />
          <Text className="mr-2">   
            Add New Form
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <Box className="w-full h-px mb-4" style={{ backgroundColor: colours.card }} />
      </Center>

      {/* Show message if no forms exist */}
      {forms.length === 0 ? (
        <Center className="flex-1 px-4 mt-8">
          <Text 
            className="text-lg text-center"
            style={{ color: colours.text, opacity: 0.6 }}
          >
            No forms yet. Create your first form!
          </Text>
        </Center>
      ) : (
        // Render form list
        <FlatList
          data={forms}
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
