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
      className="flex-row gap-1"
      style={{  }}
    >
      <Text style={{ color: colours.text, fontWeight: '600' }}>
        {item.key}:
      </Text>
      <Text style={{ color: colours.text }}>
        {item.value}
      </Text>
    </Box>
  );
}