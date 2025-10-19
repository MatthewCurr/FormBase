import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import PlusIcon from '@/assets/icons/Plus';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';
import FormBase from '@/components/custom/FormForm';

import { getForms, createForm, updateForm, deleteForm } from '@/restapi';

import { useState, useEffect } from 'react';


export default function FormListScreen() {
  const router = useRouter();

  const colours = useTheme().colors; 

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [forms, setForms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================
  // Use Effects
  // ===================

  useEffect(() => {
    // Fetch forms when formData changes (after create/update)
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const forms = await getForms();
      console.log('Fetched forms:', forms);
      setForms(forms);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Failed to load forms.');
      setLoading(false);
    } finally {
      setLoading(false);  
    }
  };


  // ===================
  // Form Handlers
  // ===================
  const handleFormSubmit = async () => {

    // Prepare form data
    const newForm = {
      name: formData.name,
      description: formData.description,
    }

    console.log('📤 Submitting form payload:', JSON.stringify(newForm, null, 2));

    try {
      let form;
      if (isEditing) {
        // Update Existing Form
        form = await updateForm(newForm, editingFormId);
      } else {
        // Create New Form
        form = await createForm(newForm);
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Reset form state
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setIsEditing(false);

      // Refresh forms list
      fetchForms();

    } catch (err) {
      console.error(err);
      console.error('testing')
      setError('Failed to save form.');
    }
  };


  const renderFormItem = ({ item }) => (
    <Box 
      className="mx-4 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colours.card }}
    >
      <Text 
        className="text-lg font-bold mb-2"
        style={{ color: colours.text }}
      >
        {item.name}
      </Text>
      <Text 
        className="text-sm mb-4"
        style={{ color: colours.text, opacity: 0.7 }}
      >
        {item.description}
      </Text>
      
      <Box className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 p-3 rounded-lg items-center"
          style={{ backgroundColor: colours.primary }}
          onPress={() => handleEditForm(item)}
        >
          <Text style={{ color: '#fff' }} className="font-semibold">
            Edit
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-1 p-3 rounded-lg items-center bg-red-500"
          onPress={() => handleDeleteForm(item.id)}
        >
          <Text style={{ color: '#fff' }} className="font-semibold">
            Delete
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );

  return (
    <Box className="flex-1">

      {showForm ? (
        <FormBase 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={isEditing}
        />
      ) : (
        <>
          <Center className="">
            <TouchableOpacity
              style={{ backgroundColor: colours.card }}
              className="p-4 m-4 w-[250px] justify-center gap-2 flex-row items-center rounded-xl"
              onPress={() => setShowForm(true)}
            >
              <PlusIcon size={16} color={colours.text} />
              <Text className="mr-2">   
                Add New Form
              </Text>
            </TouchableOpacity>

            <Box className="w-full h-px mb-4" style={{ backgroundColor: colours.card }} />

          </Center>

          {forms.length === 0 ? (
            <Center className="flex-1 px-4 mt-8">
              <Text 
                className="text-lg text-center"
                style={{ color: colours.text, opacity: 0.6 }}
              >
                No forms yet. Create your first form!
              </Text>
            </Center>
          ) : (
            <FlatList
              data={forms}
              renderItem={renderFormItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </>
      )}
        
    </Box>
  );
}
