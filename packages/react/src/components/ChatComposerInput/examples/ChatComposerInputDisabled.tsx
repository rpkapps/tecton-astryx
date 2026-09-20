import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerInputDisabled() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        isDisabled
        input={<ChatComposerInput isDisabled placeholder="Input is disabled" />}
      />
    </Stack>
  );
}
