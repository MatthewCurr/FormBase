// components/custom/RecordDisplay.jsx

import HapticButton from '@/components/custom/HapticButton';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';
import { FlatList, View } from 'react-native'

/**
 * Displays a single form entry with Edit and Delete buttons.
 *
 * @param {Object} props
 * @param {Object} props.item - The form data (id and recorded fields).
 * @param {Object} props.colours - Theme colours for background/text.
 */
export default function RecordItem({ item, colours }) {

  return (
    <Box
      className="flex-row gap-1 mb-1"
      style={{ flexWrap: 'wrap' }}
    >
      <Text 
        style={{ color: colours.text, fontWeight: '600', 
                  flex:1, flexWrap: 'wrap' }}
      >
        {item.key}:
      </Text>
      <Text 
        style={{ color: colours.text, flexShrink: 1 }}
      >
        {typeof item.value === 'object' ?
          `Lat: ${item.value.latitude.toFixed(6)}° | Lon: ${item.value.longitude.toFixed(6)}°` :
          item.value
        }
      </Text>
    </Box>
  );
}