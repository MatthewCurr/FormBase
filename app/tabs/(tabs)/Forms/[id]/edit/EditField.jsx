import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { createField, getFields } from '@/restapi';

import { Box } from '@/components/ui/box';

import { Text, TextInput, Alert, View, Switch } from 'react-native';

export default function AddForm() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); 

  const [formData, setFormData] = useState({ name: '', field_type: '', required: false, is_num: false });

  const formFields = [
    { name: 'name', label: 'Field Name', placeholder: 'Enter Field Name', required: true},
    { name: 'field_type', label: 'Field Type', placeholder: 'Enter Field Type', required: true, 
      type: 'dropdown', options: ["Text", "Multiline", "DropDown", "Image", "Location"]},
  ];
  
  const titles = ["Add a Field"]
  const buttons = ["Add Field"]

  useEffect(() => {
    setFormData({ name: '', field_type: '', required: false, is_num: false });
  }, [id])

  const handleSubmit = async () => {

    // First, check if dropdown options are required
    if (formData.field_type === 'DropDown' && !formData.options) {
      Alert.alert('Missing Required Fields', `Please enter dropdown options before submitting.`)
      return;
    }

    try {
      // Get the current number of fields for this form
      const existingFields = await getFields(id);
      const order_index = (existingFields?.length || 0) + 1;

      // Add order_index into the API payload
      const payload = { ...formData, order_index, form_id: id };

      // Create the Field Data in the API
      await createField(payload);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(`/tabs/Forms/${id}/edit/EditField`); // go back to fields edit

      // Reset Form Data
      setFormData({ name: '', field_type: '', required: false, is_num: false });
    } catch (err) {
      console.error(err);
      Alert.alert("Submission Error",`Failed to save field\n${err}`);
    }
  };

  return (
    <FormBase
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/tabs/Forms')}
      isEditing={false}
      fields={formFields}
      title={titles}
      button={buttons}
    >
      {/* Dropdown Options -- Only if Dropdown Selected */}
      {formData.field_type === 'DropDown' ? (
        <Box className="mb-4">
          <Text className="text-base mb-1 font-semibold dark:text-white">
            Dropdown Options
          </Text>

          <TextInput
            value={formData["options"] || ''}
            onChangeText={(value) => {

              const options = value.split(',')

              setFormData((prev) => ({
                ...prev,
                ["options"]: options,
              }))
            }}
            placeholder="Enter options separated by commas"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-400 rounded-lg p-3 bg-white text-black"
          />
        </Box>
      ) : null}
      {/* Form Option Toggle Switches */}
      <Box className="mb-4">
        <Text className="text-base font-semibold mb-2 dark:text-white">
          Field Options
        </Text>

        {/* Required */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="dark:text-white">Required</Text>
          <Switch
            value={!!formData.required}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, required: value }))
            }
          />
        </View>

        {/* Numeric */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="dark:text-white">Is Numeric</Text>
          <Switch
            value={!!formData.is_num}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, is_num: value }))
            }
          />
        </View>
      </Box>
    </FormBase>
  );
}