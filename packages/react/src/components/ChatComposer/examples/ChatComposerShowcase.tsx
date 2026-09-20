import {ChatComposer} from '../ChatComposer.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer onSubmit={() => {}} placeholder="Type a message…" />
    </Stack>
  );
}
