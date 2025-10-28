// Forms.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect, useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

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
import HapticButton from '@/components/custom/HapticButton'
import RecordFilter from '@/components/custom/RecordFilter';

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { getRecords, getFilteredRecords, deleteRecord, 
          getForm, getFields } from '@/restapi';


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

  // List of form fields
  const [fields, setFields] = useState([]);

  // Store Form Name for display
  const [formName, setFormName] = useState('');

  // Filter Menu
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Copied Text in Clipboard
  const [copiedText, setCopiedText] = useState('');

  // ===================
  // Use Effects
  // ===================

  useFocusEffect(
    useCallback(() => {
      // Fetch fields on component focus.
      fetchRecords();
    }, [id])
  );

  /**
   * Fetches all records from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchRecords = async () => {
    try {
      setLoading(true);

      // Fetch and Set Records
      const records = await getRecords(id);
      setRecords(records);

      // Fetch and Set Fields
      const fields = await getFields(id);
      setFields(fields);

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
   * Confirms deletion and removes the record if confirmed.
   * @param {number} id - ID of the record to delete.
   */
  const handleDeleteRecord = async (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to permanently delete this record?\n',
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
              await deleteRecord(id); // Delete form from API.
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              fetchRecords(); // Refresh list after deletion
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
   * Handles copying a record's data.
   * @param {*} item - The record item to copy.
   */
  const handleCopyRecord = async (item) => {
    try {
      // Convert object to JSON string
      const jsonString = JSON.stringify(item, null, 1); // Copy with spaces
      await Clipboard.setStringAsync(jsonString);
      Alert.alert('Copied!', 'Record JSON has been copied to clipboard.');
    } catch (err) {
      console.error('Failed to copy record:', err);
      Alert.alert('Error', 'Failed to copy record.');
    }
  };

  const handleApplyFilters = async (appliedFilters, logicOperator) => {
    try {
      setLoading(true);

      // Applied Filters: {"1": {"operator": "equals", "value": "Test"}, "4": {"operator": "gt", "value": "Osjffe"}}

      // Fetch and Set Records
      const records = await getFilteredRecords(id, appliedFilters, logicOperator);
      
      console.log("Retrieved Filtered Records:", records);
      setRecords(records);

    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load filtered records.');
      setLoading(false);
    } finally {
      setLoading(false);  
      // setFilterMenuOpen(false);
    }
  };


  const handleClearFilters = () => {
    fetchRecords();
    setFilterMenuOpen(false);
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
        <Box className="flex-1 px-4 pt-4">
          {/* Form Name and Number of Records */}
          <Center className="m-4">
            <Heading>Records for {formName}</Heading>

            <Text>Showing {records.length} records...</Text>

            {/* Filter Menu */}
            {filterMenuOpen && (
              <Box className="w-full bg-transparent mt-4 p-4 border rounded-lg" style={{ borderColor: colours.primary }}>
                {/* Title */}
                <Heading className="mb-4" style={{ color: colours.text }}>Filter Records</Heading>

                {/* Main Filter Section */}
                <RecordFilter colours={colours} fields={fields} onApplyFilter={handleApplyFilters} onClearFilter={handleClearFilters} />

                {/* Close Filter Menu Button */}
                <HapticButton
                  className="px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: 'transparent', 
                    borderColor: colours.primary, 
                    borderWidth: 2 
                  }}
                  onPress={() => {
                    setFilterMenuOpen(false);
                  }}
                >
                  <Text className="font-semibold" style={{ color: colours.text }}>Close Filter Menu</Text>
                </HapticButton>
              </Box>
            )}

            {/* Filter Records Button */}
            {!filterMenuOpen && (
              <HapticButton
                className="mt-4 px-5 py-3 rounded-full"
                style={{ backgroundColor: colours.primary }}
                onPress={() => {
                  setFilterMenuOpen(true);
                }}
              >
                <Text className="text-white font-semibold">Filter Records</Text>
              </HapticButton>
            )}
          </Center>

          {/* Render record display list */}
          <FlatList
            data={records}
            renderItem={({ item }) => (
              <RecordDisplay
                record={item}
                colours={colours}
              >
                {/* Copy Button */}
                <HapticButton
                  className="flex-1 p-1 w-20 rounded-2xl items-center absolute top-2 right-2"
                  style={{ backgroundColor: colours.card, borderColor: colours.primary, borderWidth: 2 }}
                  onPress={() => handleCopyRecord(item)}
                >
                  <Text style={{ color: colours.text }} className="font-semibold">
                    Copy
                  </Text>
                </HapticButton>
        
                {/* Delete Button */}
                <HapticButton
                  className="mt-4 mx-2 flex-1 p-3 rounded-lg items-center bg-red-500"
                  onPress={() => handleDeleteRecord(item.id)}
                  haptic="heavy"
                >
                  <Text style={{ color: '#fff' }} className="font-semibold">
                    Delete
                  </Text>
                </HapticButton>
              </RecordDisplay>
            )}
            keyExtractor={(item, index) => `${item.form_id}-${index}`} // Each Record has unique ID
          />
        </Box>
      )}
    </Box>
  );
}
