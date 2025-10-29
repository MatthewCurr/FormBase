// MapCustom.jsx - Map with Markers

// ================================
// React & React Native Imports
// ================================
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, Image } from 'react-native';

// ================================
// UI Component Imports
// ================================
import { Center } from '@/components/ui/center'
import { Divider } from '@/components/ui/divider'
import { Box } from '@/components/ui/box';

/** 
  * Render Map with custom markers containing record data
  * Only renders records with location data. 
  * 
  * @param {Object[]} records - Array of record objects containing form data.
  * @returns {JSX.Element} A styled map view with custom markers.
  */ 
export default function MapCustom({records}) {
  return (
    <Center className="mt-2">
      <Text className="text-xl mb-2 mt-4 font-semibold dark:text-white">Map View</Text>
      <Divider className="mb-4"/>

      {/* Map container */}
      <MapView style={{width: '100%', height: '100%' }}>
        {records.map((record, index) => {

          // Only use records with a location on the map.
          const locationRecord = Object.values(record.values).find(
            (value) => value && typeof value === 'object' &&
                      'latitude' in value && 'longitude' in value
          )

          // Filter out record values.
          const recordValues = Object.entries(record.values)
            .filter(([key, value]) => value !== locationRecord)

          // Check if value is an image URI
          const isImage = (value) => { 
            return (
              value && typeof value === 'string' &&
              (value.startsWith('file://') &&
              (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.jpeg')))
            );
          }

          {/* Only render if a record has location data */}
          if (locationRecord) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: locationRecord.latitude,
                  longitude: locationRecord.longitude
                }}
              >
                {/* Custom Map Marker */}
                <Callout>
                  <Box className="p-2" style={{ maxWidth: 200 }}>
                    <Text className="font-bold mb-1">Record ID: {record.id}</Text>
                    
                    {/* Map record values */}
                    {recordValues.map(([key, value]) => (
                      <Box key={`${key}-${value}`}>
                        <Text className="font-semibold mb-1">
                          {key}:
                        </Text>
                        {isImage(value) ? (
                          <Image
                            source={{ uri: value }}
                            style={{ width: '100%', height: 100, borderRadius: 8 }}
                          />
                        ) : (
                          <Text>
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </Text>
                        )}
                      </Box>
                    ))}
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