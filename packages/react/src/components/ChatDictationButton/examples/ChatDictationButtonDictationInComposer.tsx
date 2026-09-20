import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatDictationButton} from '../ChatDictationButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import type {UseSpeechRecognitionReturn} from '../../../support/index.js';

const noop = () => {};

const idleDictation: UseSpeechRecognitionReturn = {
  volume: 0,
  rawBands: [0, 0, 0, 0, 0],
  bands: [0, 0, 0, 0, 0],
  isSupported: true,
  isListening: false,
  isSpeaking: false,
  interimTranscript: '',
  start: noop,
  stop: noop,
  abort: noop,
  toggle: noop,
};

export function ChatDictationButtonDictationInComposer() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="small" color="secondary">
        Dictation button in the sendActions slot
      </Text>
      <ChatComposer
        onSubmit={() => {}}
        placeholder="Type or tap the mic to dictate..."
        sendActions={<ChatDictationButton dictation={idleDictation} />}
      />
    </Stack>
  );
}
