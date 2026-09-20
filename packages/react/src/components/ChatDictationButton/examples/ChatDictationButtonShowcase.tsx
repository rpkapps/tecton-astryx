import {useRef} from 'react';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../../ChatComposerInput/ChatComposerInput.js';
import {ChatDictationButton} from '../ChatDictationButton.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {useChatDictation} from '../../../support/index.js';
import type {ChatComposerInputHandle} from '../../../support/index.js';

export function ChatDictationButtonShowcase() {
  const inputRef = useRef<ChatComposerInputHandle>(null);

  const dictation = useChatDictation({
    inputRef,
    hasSounds: true,
    onResult: text => {
      console.log('Dictation result:', text);
    },
  });

  return (
    <VStack gap={4} width={450} maxWidth="100%">
      <Text variant="small" color="secondary">
        Click the microphone to start dictating. Speech is transcribed into the
        input.
      </Text>
      <ChatComposer
        onSubmit={v => console.log('Submit:', v)}
        input={<ChatComposerInput handleRef={inputRef} />}
        sendActions={<ChatDictationButton dictation={dictation} />}
      />
      {dictation.isListening && (
        <HStack gap={2}>
          <Text variant="small" color="secondary">
            {dictation.isSpeaking ? 'Speaking detected' : 'Listening...'}
          </Text>
          <div
            style={{
              width: 80,
              height: 6,
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: dictation.isSpeaking
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)',
                borderRadius: 3,
                transition: 'width 0.08s ease-out',
                width: `${Math.min(dictation.volume * 200, 100)}%`,
              }}
            />
          </div>
        </HStack>
      )}
      {!dictation.isSupported && (
        <Text variant="small" color="accent">
          SpeechRecognition is not supported in this browser.
        </Text>
      )}
    </VStack>
  );
}
