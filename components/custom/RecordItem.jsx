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
      className="mx-4 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colours.card }}
    >

      <View style={{ marginBottom: 6 }}>
        <Text style={{ color: colours.text, fontWeight: '600' }}>
          {item.key}:
        </Text>
        <Text style={{ color: colours.text, marginLeft: 8 }}>
          {item.value}
        </Text>
      </View>
      
    </Box>
  );
}