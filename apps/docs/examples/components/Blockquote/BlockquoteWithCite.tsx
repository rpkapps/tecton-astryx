'use client';

import {Blockquote} from '@tecton/react/Blockquote';
import {VStack} from '@tecton/react/Layout';

export function BlockquoteWithCite() {
  return (
    <VStack gap={4} style={{maxWidth: 500}}>
      <Blockquote>
        Design is not just what it looks like and feels like. Design is how it
        works.
      </Blockquote>
      <Blockquote cite="Steve Jobs">
        The people who are crazy enough to think they can change the world are
        the ones who do.
      </Blockquote>
    </VStack>
  );
}
