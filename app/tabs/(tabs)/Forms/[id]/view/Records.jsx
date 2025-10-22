
import { useGlobalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';

export default function FormRecords() {
  
  const { id } = useGlobalSearchParams();


  return (
    <Box style={{ padding: 20 }}>
      <Text>Records Page for form {id}</Text>
    </Box>
  );
}