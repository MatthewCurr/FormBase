// Map.jsx - Map View for Form Records

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
import { useTheme } from '@react-navigation/native';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';

// ================================
// Custom Component Imports
// ================================
import MapCustom from '@/components/custom/MapCustom'

// ================================
// Haptics & API Imports
// ================================
import { getRecords } from '@/restapi';

export default function FormMap() {
  const colours = useTheme().colors; // Theme colours
  const { id } = useGlobalSearchParams(); // Form ID

  // ===================
  // State Variables
  // ===================

  // List of fields from API
  const [records, setRecords] = useState([]);

  const [formData, setFormData] = useState({});

  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================
  // Use Effects
  // ===================

  useFocusEffect(
    useCallback(() => {
      // Fetch records on component focus.
      fetchRecords();
    }, [id])
  );

  /**
   * Fetches records for given id from the server and updates state.
   * Handles loading state and potential fetch errors.
   */
  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Fetch all records from api.
      const records = await getRecords(id);

      const locationRecords = records.filter(record => {
        return Object.values(record.values).some(value => {
          return typeof value === 'object' && value !== null &&
                'latitude' in value && 'longitude' in value;
        });
      });

      // Set Records for use in rendering.
      setRecords(locationRecords);

    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records.');
      setLoading(false);
    } finally {
      setLoading(false);  
    }
  };

  // ===================
  // Render Component
  // ===================
  return (
    <Box style={{ padding: 20 }}>
      
      {loading ? ( // Loading State
        <Center className="mt-40">
          <Text style={{ color: colours.text}} className="font-semibold text-xl">
            Loading...
          </Text>
        </Center>
      ) : error ? ( // Error State
        <Text>{error}</Text>
      ) : records.length > 0 ? ( // If there are records with location data
        <MapCustom records={records} />
      ) : (
        <Center className="mt-40">
          <Text style={{ color: colours.text, textAlign: 'center'}} className="font-semibold text-xl">
            This form does not have any records with locations. Add records with location data to view here.
          </Text>
        </Center>
      )}
    </Box>
  );
}