import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';
import * as Haptics from 'expo-haptics';
import { getForm, updateForm } from '@/restapi';

export default function EditForm() {
  const { id } = useGlobalSearchParams(); // ID of Form to Edit
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const formFields = [
    { name: 'name', label: 'Form Name', placeholder: 'Enter Label Name', required: true },
    { name: 'description', label: 'Form Description', placeholder: 'Enter Description', required: true },
  ];

  // ===================
  // Use Effects
  // ===================

  useEffect(() => {

    /**
     * Fetches editing form from the server and updates state.
     */
    const fetchForm = async () => {
      try {
        let form = await getForm(id.toString()); // Get Form by id
        form = form[0] // Take first (and only) index

        // Populate fields with retrived data
        if (form) setFormData({ name: form.name, description: form.description });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();

  }, [id]);


  // ===================
  // Form Handlers
  // ===================

  /**
   * Handles creation or update of a form.
   * Sends the form data to the backend and refreshes the list on success.
   */
  const handleSubmit = async () => {
    if (!formData.name?.trim() || !formData.description?.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Update Existing form
      await updateForm(formData, id);

      // Provide haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      router.push('/tabs/Forms'); // go back to forms list
      
    } catch (err) {
      console.error(err);
      alert('Failed to save form.');
    }
  };

  if (loading) return null;

  return (
    <FormBase
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/tabs/Forms')}
      isEditing={true} // Editing Form with ID
      fields={formFields}
    />
  );
}