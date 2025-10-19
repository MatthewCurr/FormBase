
// components/custom/FormItem.jsx

import HapticButton from '@/components/custom/HapticButton';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';

/**
 * Displays a single form entry with Edit and Delete buttons.
 *
 * @param {Object} props
 * @param {Object} props.item - The form data (id, name, description).
 * @param {Function} props.onEdit - Called when the Edit button is pressed.
 * @param {Function} props.onDelete - Called when the Delete button is pressed.
 * @param {Object} props.colours - Theme colours for background/text.
 */
export default function FormItem({ item, onEdit, onDelete, colours }) {
  return (
    <Box
      className="mx-4 mb-4 p-4 rounded-xl"
      style={{ backgroundColor: colours.card }}
    >
      <Text 
        className="text-lg font-bold mb-2"
        style={{ color: colours.text }}
      >
        {item.name}
      </Text>
      <Text 
        className="text-sm mb-4"
        style={{ color: colours.text, opacity: 0.7 }}
      >
        {item.description}
      </Text>
      
      <Box className="flex-row gap-2">
        <HapticButton
          className="flex-1 p-3 rounded-lg items-center"
          style={{ backgroundColor: colours.primary }}
          onPress={() => onEdit(item)}
        >
          <Text style={{ color: '#fff' }} className="font-semibold">
            Edit
          </Text>
        </HapticButton>

        <HapticButton
          className="flex-1 p-3 rounded-lg items-center bg-red-500"
          onPress={() => onDelete(item.id)}
          haptic="heavy"
        >
          <Text style={{ color: '#fff' }} className="font-semibold">
            Delete
          </Text>
        </HapticButton>
      </Box>
    </Box>
  );
}