'use client';

import {Kbd} from '@tecton/react/Kbd';
import {VStack} from '@tecton/react/Stack';
import {Text} from '@tecton/react/Text';

export function KbdInlineInstructions() {
  return (
    <VStack gap={3}>
      <Text type="body">
        Press <Kbd keys="mod+k" /> to open the command palette.
      </Text>
      <Text type="body">
        Use <Kbd keys="mod+shift+p" /> to access all commands.
      </Text>
      <Text type="body">
        Press <Kbd keys="escape" /> to close the dialog.
      </Text>
      <Text type="body">
        Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys, then
        press <Kbd keys="enter" /> to select.
      </Text>
    </VStack>
  );
}
