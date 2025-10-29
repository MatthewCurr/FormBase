// RecordDisplay.jsx - Display List for All Records

// ================================
// React Native Imports
// ================================
import { FlatList } from 'react-native'

// ================================
// UI Component Imports
// ================================
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

// ================================
// Custom Component Imports
// ================================
import RecordItem from '@/components/custom/RecordItem'

/**
 * Displays a single form entry with Edit and Delete buttons.
 *
 * @param {Object} props
 * @param {Object} props.record - The record data (id and recorded fields).
 * @param {Object} props.colours - Theme colours for background/text.
 * @param {ReactElement} children - Child Components to render in display. 
 * @returns {JSX.Element} The rendered record card.
*/
export default function RecordDisplay({ record, colours, children }) {
  return (
    <Box
      className="mx-2 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colours.card }}
    >
      {/* Display Record ID as Title */}
      <Text
        className="text-lg font-semibold"
        style={{ color: colours.text }}
      >
        Record ID #{record.id}
      </Text>

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
        className="mt-2"
      />

      {/* If Child Components given render below */}
      {children}

    </Box>
  );
}

