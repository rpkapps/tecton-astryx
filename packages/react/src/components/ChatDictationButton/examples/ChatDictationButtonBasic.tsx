import {useRef} from 'react';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../../ChatComposerInput/ChatComposerInput.js';
import {ChatDictationButton} from '../ChatDictationButton.js';
import {Stack} from '../../Stack/Stack.js';
import {useChatDictation} from '../../../support/index.js';
import type {ChatComposerInputHandle} from '../../../support/index.js';

export function ChatDictationButtonBasic() {
  const inputRef = useRef<ChatComposerInputHandle>(null);

  const dictation = useChatDictation({
    inputRef,
    onResult: text => {
      console.log('Dictation result:', text);
    },
  });

  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => console.log('Submit:', value)}
        input={<ChatComposerInput handleRef={inputRef} />}
        sendActions={<ChatDictationButton dictation={dictation} />}
      />
    </Stack>
  );
}
