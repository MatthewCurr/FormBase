// components/custom/RecordDisplay.jsx

import HapticButton from '@/components/custom/HapticButton';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';
import { FlatList, View, Image, Dimensions } from 'react-native'

// Get the screen width and height for styling
const { height } = Dimensions.get("window");

/**
 * Displays a single form entry with Edit and Delete buttons.
 *
 * @param {Object} props
 * @param {Object} props.item - The form data (id and recorded fields).
 * @param {Object} props.colours - Theme colours for background/text.
 */
export default function RecordItem({ item, colours }) {

  const value = item.value;

  // Check if value is a location object
  const isLocation = 
    value && typeof value === 'object' &&
    'latitude' in value && 
    'longitude' in value;

  // Check if value is an image URI
  const isImage = 
    value && typeof value === 'string' &&
    (value.startsWith('file://') &&
    (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.jpeg')));

  return (
    <Box
      className="flex-col gap-1 mb-4"
      style={{ flexWrap: 'wrap' }}
    >
      {/* Key Name */}
      <Text 
        style={{ color: colours.text, fontWeight: '600', 
                  flexWrap: 'wrap' }}
      >
        {item.key}:
      </Text>

      {/* Key Value */}
      {isLocation ? (
        <Text 
        style={{ color: colours.text, flexWrap: 'wrap', flex: 1, textAlign: 'left' }}
      >
        Lat: {item.value.latitude.toFixed(6)}° | Lon: {item.value.longitude.toFixed(6)}°
      </Text>
      ) : isImage ? (
        <Image
          source={{ uri: item.value }}
          style={{ width: '100%', height: height/4, borderRadius: 6 }}
        />
      ) : ( 
        <Text 
          style={{ color: colours.text, flexWrap: 'wrap', flex: 1, textAlign: 'left' }}
        >
          {String(value)}
        </Text>
      )}
    </Box>
  );
}