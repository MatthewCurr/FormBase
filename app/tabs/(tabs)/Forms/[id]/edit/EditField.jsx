import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { createForm } from '@/restapi';

import { Box } from '@/components/ui/box';

import { Text, TextInput } from 'react-native';

export default function AddForm() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); 

  const [formData, setFormData] = useState({ name: '', description: '' });

  const formFields = [
    { name: 'name', label: 'Field Name', placeholder: 'Enter Field Name', required: true, multiline: true, is_num: true},
    { name: 'fieldtype', label: 'Field Type', placeholder: 'Enter Field Type', required: true, 
      type: 'dropdown', options: ["Text", "Multiline", "DropDown", "Image", "Location"]},
  ];
  
  const titles = ["Add a Field"]
  const buttons = ["Add Field"]

  useEffect(() => {
    setFormData({});
  }, [id])

  const handleSubmit = async () => {

    try {
      await createForm(formData);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/tabs/Forms'); // go back to forms list
    } catch (err) {
      console.error(err);
      alert('Failed to save form.');
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
      {formData.fieldtype === 'DropDown' ? (
        <Box className="mb-4">
          <Text className="text-sm mb-1 font-semibold dark:text-white">
            Dropdown Options
          </Text>

          <TextInput
            value={formData["options"] || ''}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                ["options"]: value,
              }))
            }
            placeholder="Enter options separated by commas"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-400 rounded-lg p-3 bg-white text-black"
          />
        </Box>
      ) : null}
    </FormBase>
  );
}