'use client';

import {Heading} from '@tecton/react/Text';
import {Stack} from '@tecton/react/Stack';

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
