// AddForm.jsx - Screen to add a new form

// ================================
// React & React Native Imports
// ================================
import { useState } from 'react';

// ================================
// Navigation and Theme Imports
// ================================
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

// ================================
// Custom Component Imports
// ================================
import FormBase from '@/components/custom/FormForm';

// ================================
// Haptics & API Imports
// ================================
import * as Haptics from 'expo-haptics';
import { createForm } from '@/restapi';


// Main Add Form Screen Component

/** 
 * AddForm component allows users to create a new form.
 * @returns {JSX.Element}
 */
export default function AddForm() {
  const router = useRouter(); // Navigation router

  // ===================
  // State Variables
  // ===================

  // Form Data State
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Form Fields Definition
  const formFields = [
    { name: 'name', label: 'Form Name', placeholder: 'Enter Label Name', required: true },
    { name: 'description', label: 'Form Description', placeholder: 'Enter Description', required: true },
  ];

  // ===================
  // Form Handlers
  // ===================

  // Handles form submission to create a new form
  const handleSubmit = async () => {
    try {
      await createForm(formData); // API call to create form
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/tabs/Forms'); // Go back to Forms list
    } catch (err) {
      console.error(err);
      alert('Failed to save form.');
    }
  };

  // ===================
  // Render
  // ===================
  return (
    <FormBase
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/tabs/Forms')}
      isEditing={false}
      fields={formFields}
    />
  );
}