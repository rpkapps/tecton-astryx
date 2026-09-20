import {Kbd} from '../Kbd.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function KbdInlineInstructions() {
  return (
    <VStack gap={3}>
      <Text variant="medium">
        Press <Kbd keys="mod+k" /> to open the command palette.
      </Text>
      <Text variant="medium">
        Use <Kbd keys="mod+shift+p" /> to access all commands.
      </Text>
      <Text variant="medium">
        Press <Kbd keys="escape" /> to close the dialog.
      </Text>
      <Text variant="medium">
        Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys, then
        press <Kbd keys="enter" /> to select.
      </Text>
    </VStack>
  );
}
