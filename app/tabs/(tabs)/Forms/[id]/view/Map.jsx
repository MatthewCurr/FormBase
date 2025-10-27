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
import { getRecords } from '@/restapi';

export default function FormMap() {
  
  const { id } = useGlobalSearchParams();

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

      console.log(locationRecords);

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

  return (
    <Box style={{ padding: 20 }}>
      
      {loading ? (
        <Text>Loading map...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : records ? (
        <MapCustom records={records} />
      ) : (
        <Text>This Form does not have any records with locations.</Text>
      )}

    </Box>
  );
}