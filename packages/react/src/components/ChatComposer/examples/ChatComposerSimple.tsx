import {ChatComposer} from '../ChatComposer.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerSimple() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => {
          console.log('Sent:', value);
        }}
      />
    </Stack>
  );
}
