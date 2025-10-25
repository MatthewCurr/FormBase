// components/custom/RecordDisplay.jsx

import HapticButton from '@/components/custom/HapticButton';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';
import { FlatList, View } from 'react-native'
import RecordItem from '@/components/custom/RecordItem'

/**
 * Displays a single form entry with Edit and Delete buttons.
 *
 * @param {Object} props
 * @param {Object} props.item - The form data (id and recorded fields).
 * @param {Object} props.colours - Theme colours for background/text.
 */
export default function RecordDisplay({ record, colours }) {

  console.log(`Record is`, record)

  return (
    <Box
      className="mx-2 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colours.card }}
    >

      {/* Render record list */}
      <FlatList
        data={Object.entries(record.values || {}).map(([key, value]) => ({ key, value }))}
        renderItem={({ item }) => (
          <RecordItem
            item={item}
            colours={colours}
          />
        )}
        keyExtractor={(record) => `${record.key}-${record.value}`}
      />
    </Box>
  );
}

