// MapCustom.jsx

// ================================
// React & React Native Imports
// ================================

import MapView, { Marker, Callout } from 'react-native-maps';
import { Text } from 'react-native';

// ================================
// UI Component Imports
// ================================

import { Center } from '@/components/ui/center'
import { Divider } from '@/components/ui/divider'
import { Box } from '@/components/ui/box';

export default function MapCustom({records}) {

  return (
    <Center className="mt-2">
      <Text className="text-xl mb-2 mt-4 font-semibold dark:text-white">Map View</Text>
      <Divider className="mb-4"/>
      <MapView style={{width: '100%', height: '100%' }}>
        {records.map((record, index) => {

          const locationRecord = Object.values(record.values).find(
            (value) => value && typeof value === 'object' &&
                      'latitude' in value && 'longitude' in value
          )

          const recordValues = Object.entries(record.values)
            .filter(([key, value]) => value !== locationRecord)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join('\n');

          if (locationRecord) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: locationRecord.latitude,
                  longitude: locationRecord.longitude
                }}
              >
                <Callout>
                  <Box className="p-2" style={{ maxWidth: 200 }}>
                    <Text className="font-bold mb-1">Record ID: {record.id}</Text>
                    <Text>{recordValues}</Text>
                  </Box>
                </Callout>
              </Marker>
            );
          }
        })}
      </MapView>
    </Center>
  )
}