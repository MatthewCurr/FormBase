import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { createForm } from '@/restapi';

export default function AddForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', description: '' });

  const formFields = [
    { name: 'name', label: 'Field Name', placeholder: 'Enter Field Name', required: true },
  ];
  
  const titles = ["Add a Field"]
  const buttons = ["Add Field"]

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