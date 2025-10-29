// RecordFilter.jsx - Filter Menu for Record List.

// ================================
// React & React Native Imports
// ================================
import { useState } from 'react';
import {  Alert,Text, TextInput } from 'react-native';

// ================================
// Navigation and Theme Imports
// ================================
import { useGlobalSearchParams } from 'expo-router';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';

import DropDownPicker from 'react-native-dropdown-picker';

// ================================
// Custom Component Imports
// ================================
import HapticButton from '@/components/custom/HapticButton'


/** Provides an interactive filter menu for narrowing down
 * records in the Record List screen.
 *
 * Users can:
 * - Select a field to filter on (non-image/location fields)
 * - Choose a comparison operator (string or numeric)
 * - Input a comparison value
 * - Combine multiple filters with AND/OR logic
 * - Apply or clear filters
 *
 * @param {Object} props
 * @param {Object} props.colours - Theme colours for text, background, and borders.
 * @param {Array} props.fields - List of available form fields to filter on.
 * @param {Array} props.filters - Current list of applied filters.
 * @param {Function} props.setFilters - Function to update the active filters array.
 * @param {string} props.logicOperator - Current logic operator (AND/OR) for combining filters.
 * @param {Function} props.setLogicOperator - Function to set the logic operator.
 * @param {Function} props.onApplyFilter - Callback when filters are applied.
 * @param {Function} props.onClearFilter - Callback when filters are cleared.
 */
export default function RecordFilter({ 
  colours,
  fields,
  filters, 
  setFilters, 
  logicOperator, 
  setLogicOperator,
  onApplyFilter,
  onClearFilter
}) {

  // ===================
  // State Variables
  // ===================

  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);
  const [operator, setOperator] = useState(null);

  const [inputValue, setInputValue] = useState(''); 

  const [logicDropdownOpen, setLogicDropdownOpen] = useState(false);

  // ==============================
  // Filter Options
  // ==============================

  // Operators for text-based fields
  const stringOptions = [
    { label: 'Equals', value: 'eq' },
    { label: 'Contains (LIKE)', value: 'contains' },
    { label: 'Starts With', value: 'starts' },
  ];

  // Operators for numeric fields
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
    value: f.name,
  }));

  // Find the currently selected field object
  const selectedFieldObj = filteredFields.find(f => f.name === selectedField);

  // Decide which operator list to use
  const operatorOptions = selectedFieldObj?.is_num ? numericOptions : stringOptions;

  // ================== 
  // Handler Functions
  // ==================

  /**
   * Adds a new filter to the filter list if all required fields are filled.
   * Alerts the user if any part of the filter is missing.
   */
  const handleAddFilter = () => {
    if (selectedField && operator && inputValue) {
      setFilters([
        ...filters,
        {
          field: selectedField,
          operator: operator,
          value: inputValue
        }
      ]);

      // Reset dropdowns and inputs
      setSelectedField(null);
      setOperator(null);
      setInputValue('');
    } else {
      // Alert user to empty fields
      const emptyFields = [];
      if (!selectedField) emptyFields.push('Field');
      if (!operator) emptyFields.push('Operator');
      if (!inputValue) emptyFields.push('Value');

      Alert.alert('Incomplete Filter', `Please select the following filter fields: ${emptyFields.join(', ')}.`);
    }
  };

  // Applies all current filters using parent handler.
  const handleApplyFilters = () => {
    onApplyFilter(filters, logicOperator);
  };

  // Clears all filters and resets state
  const handleClearFilters = () => {
    setFilters([]);
    onClearFilter();
  }


  // ==============================
  // UI Rendering
  // ==============================
  return (
    <Box className="w-full mb-4">

      {/* Field Selection */}
      <Box className="z-30 flex-row items-center gap-2 mb-4 justify-between">
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
        <Box className="z-20 flex-row items-center gap-2 mb-4 justify-between">
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
      {filters.length > 0 && (
        <Box className="z-10 flex-row items-center gap-2 mb-4 justify-between">
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
        {filters.length === 0 ? (
          <Text style={{ color: colours.text, opacity: 0.6 }}>No filters applied.</Text>
        ) : (
          filters.map((filter, idx) => {
            const field = filteredFields.find(f => f.name === filter.field);
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
      <HapticButton
        className="w-full p-4 rounded-full mb-2"
        style={{ backgroundColor: colours.primary, alignSelf: 'flex-start' }}
        onPress={handleClearFilters}
      >
        <Text className="text-white font-semibold">Clear Filters</Text>
      </HapticButton>

      {/* Apply Filter Button */}
      {filters.length > 0 && (
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