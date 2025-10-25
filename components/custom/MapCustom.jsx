// MapCustom.jsx

// ================================
// React & React Native Imports
// ================================

import MapView from 'react-native-maps';
import { Text } from 'react-native';

// ================================
// UI Component Imports
// ================================

import { Box } from '@/components/ui/box';

export default function MapCustom({field}) {

  return (
    <Box key={field.name} className="mb-4">
      <Text className="text-base mb-1 font-semibold dark:text-white">{field.label}</Text>
      <MapView style={{width: '100%', height: '100%' }}/>
    </Box>
  )
}