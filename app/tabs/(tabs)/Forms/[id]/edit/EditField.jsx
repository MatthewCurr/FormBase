import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { getForms, createForm, updateForm } from '@/restapi';

export default function FormPage() {
  const { id } = useGlobalSearchParams(); // If id exists → edit, else add
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const isEditing = id && id !== 'add';

  useEffect(() => {

    if (isEditing) {
      // Edit mode → fetch existing form
      const fetchForm = async () => {
        try {
          const forms = await getForms();
          const form = forms.find((f) => f.id.toString() === id);
          if (form) setFormData({ name: form.name, description: form.description });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    } else {
      // Add mode → start with empty form
      setFormData({ name: '', description: '' });
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.name?.trim() || !formData.description?.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (isEditing) {
        await updateForm(formData, id);
      } else {
        await createForm(formData);
      }
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/tabs/Forms'); // go back to forms list
    } catch (err) {
      console.error(err);
      alert('Failed to save form.');
    }
  };

  if (loading) return null; // or a spinner

  return (
    <FormBase
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/tabs/Forms')}
      isEditing={isEditing} // true if editing, false if adding
    />
  );
}