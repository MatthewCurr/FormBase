
import { useGlobalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';

export default function FormMap() {
  
  const { id } = useGlobalSearchParams();

  return (
    <Box style={{ padding: 20 }}>
      <Text>Map Page for form {id}</Text>
    </Box>
  );
}