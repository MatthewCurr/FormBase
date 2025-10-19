// Forms.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

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
import FormBase from '@/components/custom/FormForm';
import FormItem from '@/components/custom/FormItem';

import PlusIcon from '@/assets/icons/Plus';

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getForms, createForm, updateForm, deleteForm } from '@/restapi';


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
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [isEditing, setIsEditing] = useState(false); // Editing mode flag
  const [editingFormId, setEditingFormId] = useState(null); // ID of form being edited

  // Form data for creating/editing
  const [formData, setFormData] = useState({ name: '', description: '' });
  // List of forms from API
  const [forms, setForms] = useState([]);

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ===================
  // Use Effects
  // ===================

  useEffect(() => {
    // Fetch forms on component mount.
    fetchForms();
  }, []);

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
   * Handles creation or update of a form.
   * Sends the form data to the backend and refreshes the list on success.
   */
  const handleFormSubmit = async () => {

    // Prepare form data
    const newForm = {
      name: formData.name,
      description: formData.description,
    }

    try {
      let form;
      if (isEditing) {
        // Update Existing Form
        form = await updateForm(newForm, editingFormId);
      } else {
        // Create New Form
        form = await createForm(newForm);
      }

      // Provide haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Reset form state
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setIsEditing(false);

      // Refresh forms list
      fetchForms();

    } catch (err) {
      console.error(err);
      setError('Failed to save form.');
    }
  };


  /**
   * Populates the form fields for editing and toggles edit mode.
   * @param {Object} item - The form item to edit.
   */
  const handleEditForm = (item) => {
    setFormData({ name: item.name, description: item.description });
    setEditingFormId(item.id);
    setIsEditing(true);
    setShowForm(true);
  }

  /**
   * Confirms deletion and removes the form if confirmed.
   * @param {number} id - ID of the form to delete.
   */
  const handleDeleteForm = async (id) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form?',
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
   * Handles viewing a form's details.
   * @param {*} item - The form item to view.
   */
  const handleViewForm = (item) => {
    // Logic to view the form details
  };


  // ===================
  // UI Rendering
  // ===================
  return (
    <Box className="flex-1">
      {/* Show form if user is creating or editing */}
      {showForm ? (
        <FormBase 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={isEditing}
        />
      ) : (
        <>
          {/* Add Form Button */}
          <Center>
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
        </>
      )}
    </Box>
  );
}
