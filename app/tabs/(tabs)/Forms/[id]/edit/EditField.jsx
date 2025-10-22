import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { createForm } from '@/restapi';

export default function AddForm() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); 

  const [formData, setFormData] = useState({ name: '', description: '' });

  const formFields = [
    { name: 'name', label: 'Field Name', placeholder: 'Enter Field Name', required: true, multiline: true, is_num: true},
    { name: 'dropdown', label: 'Field Type', placeholder: 'Enter Field Type', required: true, 
      type: 'dropdown', options: [{label: "Test1", value:"test1"}, {label:"Test2", value:"test2"}]},
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
    />
  );
}