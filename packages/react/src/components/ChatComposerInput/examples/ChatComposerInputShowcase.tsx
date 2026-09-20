import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerInputShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        input={
          <ChatComposerInput placeholder="Ask me anything about Tecton..." />
        }
      />
    </Stack>
  );
}
