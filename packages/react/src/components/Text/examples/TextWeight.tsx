import {Stack} from '../../Stack/Stack.js';
import {Text} from '../Text.js';

const WEIGHTS = [
  {weight: 'normal' as const, label: 'Normal'},
  {weight: 'medium' as const, label: 'Medium'},
  {weight: 'semibold' as const, label: 'Semibold'},
  {weight: 'bold' as const, label: 'Bold'},
];

export function TextWeight() {
  return (
    <Stack direction="vertical" gap={3}>
      {WEIGHTS.map(({weight, label}) => (
        <Text key={weight} variant="medium" weight={weight} display="block">
          {label}
        </Text>
      ))}
    </Stack>
  );
}
