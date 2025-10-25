// Map.jsx

// ================================
// React & React Native Imports
// ================================
import { useState, useEffect, useCallback } from 'react';
import { Text } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';

// ================================
// Custom Component Imports
// ================================
import MapCustom from '@/components/custom/MapCustom'

// ================================
// Haptics & API Imports
// ================================
import { getFields } from '@/restapi';

export default function FormMap() {
  
  const { id } = useGlobalSearchParams();

  // ===================
  // State Variables
  // ===================

  // List of fields from API
  const [fields, setFields] = useState([]);

  const [formData, setFormData] = useState({});

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Check if any field is a location
  const hasLocationField = fields.some((f) => f.type?.toLowerCase() === 'location');

  return (
    <Box style={{ padding: 20 }}>
      <Text>Map Page for form {id}</Text>
      
      {loading ? (
        <Text>Loading fields...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : hasLocationField ? (
        <MapCustom field={fields.find((f) => f.type?.toLowerCase() === 'location')} />
      ) : (
        <Text>This Form does not have any map fields</Text>
      )}

    </Box>
  );
}