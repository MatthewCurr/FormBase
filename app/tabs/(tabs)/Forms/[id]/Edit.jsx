
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';

export default function FormEdit() {

  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Page for form {id}</Text>
    </View>
  );
}