// MapCustom.jsx

// ================================
// React & React Native Imports
// ================================

import MapView from 'react-native-maps';
import { Text } from 'react-native';

// ================================
// UI Component Imports
// ================================

import { Center } from '@/components/ui/center'
import { Divider } from '@/components/ui/divider'
import { Box } from '@/components/ui/box';

export default function MapCustom({field}) {

  return (
    <Center key={field.name} className="mt-2">
      <Text className="text-xl mb-2 mt-4 font-semibold dark:text-white">{field.label}</Text>
      <Divider className="mb-4"/>
      <MapView style={{width: '100%', height: '100%' }}/>
    </Center>
  )
}