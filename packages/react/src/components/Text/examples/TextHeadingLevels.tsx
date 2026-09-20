import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';

const LEVELS = [1, 2, 3, 4, 5, 6] as const;

export function TextHeadingLevels() {
  return (
    <Stack direction="vertical" gap={3}>
      {LEVELS.map(level => (
        <Heading key={level} level={level}>
          Heading {level}
        </Heading>
      ))}
    </Stack>
  );
}
