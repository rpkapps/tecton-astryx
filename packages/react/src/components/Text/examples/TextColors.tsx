import {Stack} from '../../Stack/Stack.js';
import {Text} from '../Text.js';

const COLORS = [
  {
    color: 'primary' as const,
    description: 'Primary — Default for headings and body text',
  },
  {
    color: 'secondary' as const,
    description: 'Secondary — Supporting details and metadata',
  },
  {
    color: 'accent' as const,
    description: 'Accent — Links, emphasis, and accent-colored text',
  },
  {
    color: 'disabled' as const,
    description: 'Disabled — Unavailable or inactive content',
  },
  {
    color: 'placeholder' as const,
    description: 'Placeholder — Empty field hints',
  },
];

export function TextColors() {
  return (
    <Stack direction="vertical" gap={3}>
      {COLORS.map(({color, description}) => (
        <Text key={color} variant="medium" color={color}>
          {description}
        </Text>
      ))}
    </Stack>
  );
}
