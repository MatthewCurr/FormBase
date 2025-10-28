// ================================
// React & React Native Imports
// ================================

import { useState, useEffect } from 'react';
import {  Alert, View, Text, TextInput, FlatList,
          TouchableOpacity, useColorScheme } from 'react-native';

import MapView from 'react-native-maps';

// ================================
// Location and Image Imports
// ================================
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

// ================================
// Navigation and Theme Imports
// ================================

import { useTheme } from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';

// ================================
// UI Component Imports
// ================================

import { Divider } from '@/components/ui/divider';
import { Center } from '@/components/ui/center';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import DropDownPicker from 'react-native-dropdown-picker';
import PlusIcon from '@/assets/icons/Plus'; // Submit Icon
import Fontisto from '@expo/vector-icons/Fontisto';

// ================================
// Custom Component Imports
// ================================
import HapticButton from '@/components/custom/HapticButton'
import Photo from '@/components/custom/Photo'

// ================================
// Haptics Imports
// ================================
import * as Haptics from 'expo-haptics';


/**

 */
export default function RecordFilter({ 
  colours,
  fields,
  onApplyFilter,
  onClearFilter
}) {

  const { id } = useGlobalSearchParams();

  // ===================
  // State Variables
  // ===================

  const [filters, setFilters] = useState({});
  
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);
  const [operator, setOperator] = useState(null);

  const [inputValue, setInputValue] = useState(''); 

  const [logicOperator, setLogicOperator] = useState('AND');
  const [logicDropdownOpen, setLogicDropdownOpen] = useState(false);

  // String filter options
  const stringOptions = [
    { label: 'Equals', value: 'equals' },
    { label: 'Contains (LIKE)', value: 'contains' },
    { label: 'Starts With', value: 'startsWith' },
  ];

  // Numeric filter options
  const numericOptions = [
    { label: 'Equals', value: 'eq' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Greater Than or Equal', value: 'gte' },
    { label: 'Less Than or Equal', value: 'lte' },
  ];

  // Filter out Image and Location fields from selectable fields
  const filteredFields = fields.filter(f => f.field_type !== 'Image' && f.field_type !== 'Location');

  const dropdownItems = filteredFields.map(f => ({
    label: f.name,
    value: f.order_index
  }));

  // Find the currently selected field object
  const selectedFieldObj = filteredFields.find(f => f.order_index === selectedField);

  // Decide which operator list to use
  const operatorOptions = selectedFieldObj?.is_num ? numericOptions : stringOptions;

  // ==================
  // Use Effects 
  // ==================

  useEffect(() => {
    // Reset filters when the page id changes
    if (id) {
      setFilters({});
    }
  }, [id]);

  // ================== 
  // Handler Functions
  // ==================

  // Handle adding a new filter
  const handleAddFilter = () => {
    if (selectedField && operator && inputValue) {
      setFilters({
        ...filters,
        [selectedField]: { operator, value: inputValue }
      });
      setSelectedField(null);
      setOperator(null);
      setInputValue('');
    } else {
      // Alert user to empty field
      const emptyFields = [];
      if (!selectedField) emptyFields.push('Field');
      if (!operator) emptyFields.push('Operator');
      if (!inputValue) emptyFields.push('Value');

      Alert.alert('Incomplete Filter', `Please select the following filter fields: ${emptyFields.join(', ')}.`);
    }
  };

  // Handle applying filters
  const handleApplyFilters = () => {
    onApplyFilter(filters, logicOperator);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({});
    onClearFilter();
  }

  /* Main Content */
  return (
    <Box className="w-full mb-4">

      {/* Field Selection */}
      <Box className="z-20 flex-row items-center gap-2 mb-4 justify-between">
        <Text style={{ color: colours.text }}>Filter Field:</Text>
        <DropDownPicker
          open={fieldDropdownOpen}
          value={selectedField}
          items={dropdownItems}
          setOpen={setFieldDropdownOpen}
          setValue={setSelectedField}
          containerStyle={{ width: 200 }}
          style={{ borderColor: colours.primary,
                  backgroundColor: colours.card,
                }}
          dropDownContainerStyle={{ borderColor: colours.primary, 
                                    backgroundColor: colours.card,
                                  }}
          textStyle={{
            color: colours.text
          }}
          labelStyle={{
            color: colours.text,
          }}
        />
      </Box>

      {/* Operator Selection */}
      {selectedField && (
        <Box className="z-10 flex-row items-center gap-2 mb-4 justify-between">
          <Text style={{ color: colours.text }}>Operator:</Text>
          <DropDownPicker
            open={operatorDropdownOpen}
            value={operator}
            items={operatorOptions}
            setOpen={setOperatorDropdownOpen}
            setValue={setOperator}
            containerStyle={{ width: 200 }}
            style={{ borderColor: colours.primary,
              backgroundColor: colours.card,
            }}
            dropDownContainerStyle={{ borderColor: colours.primary, 
                                      backgroundColor: colours.card,
                                    }}
            textStyle={{
              color: colours.text
            }}
            labelStyle={{
              color: colours.text,
            }}
          />
        </Box>
      )}
      
      {/* Value Input */}
      <Box className="flex-row items-center gap-2 mb-4 justify-between">
        <Text style={{ color: colours.text }}>Value:</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter value..."
            placeholderTextColor={colours.text}
            keyboardType={selectedFieldObj?.is_num ? 'numeric' : 'default'}
            returnKeyType="done"
            style={{ width: 200, padding: 8, 
                    borderColor: colours.primary, 
                    backgroundColor: colours.card, 
                    color: colours.text,
                    borderWidth: 1, borderRadius: 6 }}
          />
      </Box>

      {/* Add Filter Button */}
      <HapticButton
        className="w-full p-4 rounded-full mb-4"
        style={{ backgroundColor: colours.primary, alignSelf: 'flex-start' }}
        onPress={handleAddFilter}
      >
        <Text className="text-white font-semibold">Add Filter</Text>
      </HapticButton>

      {/* Logical Operator Selection */}
      {Object.keys(filters).length > 0 && (
        <Box className="z-0 flex-row items-center gap-2 mb-4 justify-between">
          <Text style={{ color: colours.text }}>Combine Filters With:</Text>
          <DropDownPicker
            open={logicDropdownOpen}
            value={logicOperator}
            items={[
              { label: 'AND', value: 'AND' },
              { label: 'OR', value: 'OR' },
            ]}
            setOpen={setLogicDropdownOpen}
            setValue={setLogicOperator}
            containerStyle={{ width: 150 }}
            style={{
              borderColor: colours.primary,
              backgroundColor: colours.card,
            }}
            dropDownContainerStyle={{
              borderColor: colours.primary,
              backgroundColor: colours.card,
            }}
            textStyle={{
              color: colours.text,     
            }}
          />
        </Box>
      )}

      {/* Current Filters */}
      <Box className="mb-4">
        <Text style={{ color: colours.text, marginBottom: 8 }}>Current Filters:</Text>
        {Object.keys(filters).length === 0 ? (
          <Text style={{ color: colours.text, opacity: 0.6 }}>No filters applied.</Text>
        ) : (
          Object.entries(filters).map(([fieldIndex, filter], idx) => {
            const field = filteredFields.find(f => f.order_index.toString() === fieldIndex);
            return (
              <Box key={idx} className="flex-row justify-between mb-2 p-2 rounded-lg" style={{ backgroundColor: colours.card }}>
                <Text
                  style={{ color: colours.text }}
                >
                  {field?.name}
                </Text>
                <Text
                  style={{ color: colours.text }} className="font-semibold"
                >
                  {(
                    (field?.is_num ? numericOptions : stringOptions)
                    .find(opt => opt.value === filter.operator)?.label || filter.operator
                  )} {filter.value}
                </Text>
              </Box>
            );
          })
        )}
      </Box>

      {/* Clear Filter Button */}
      {Object.keys(filters).length > 0 && (
        <HapticButton
          className="w-full p-4 rounded-full mb-2"
          style={{ backgroundColor: colours.primary, alignSelf: 'flex-start' }}
          onPress={handleClearFilters}
        >
          <Text className="text-white font-semibold">Clear Filters</Text>
        </HapticButton>
      )}

      {/* Apply Filter Button */}
      {Object.keys(filters).length > 0 && (
        <HapticButton
          className="w-full p-4 rounded-full"
          style={{ backgroundColor: colours.primary, alignSelf: 'flex-start' }}
          onPress={handleApplyFilters}
        >
          <Text className="text-white font-semibold">Apply Filters</Text>
        </HapticButton>
      )}

    </Box>
  );
}