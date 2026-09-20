import {ChatDictationButton} from '../ChatDictationButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import type {UseSpeechRecognitionReturn} from '../../../support/index.js';

const noop = () => {};

const idle: UseSpeechRecognitionReturn = {
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

const listening: UseSpeechRecognitionReturn = {
  volume: 0.05,
  rawBands: [0.08, 0.06, 0.04, 0.02, 0.01],
  bands: [0.08, 0.06, 0.04, 0.02, 0.01],
  isSupported: true,
  isListening: true,
  isSpeaking: false,
  interimTranscript: '',
  start: noop,
  stop: noop,
  abort: noop,
  toggle: noop,
};

const speaking: UseSpeechRecognitionReturn = {
  volume: 0.12,
  rawBands: [0.15, 0.12, 0.08, 0.05, 0.02],
  bands: [0.15, 0.12, 0.08, 0.05, 0.02],
  isSupported: true,
  isListening: true,
  isSpeaking: true,
  interimTranscript: 'hello world',
  start: noop,
  stop: noop,
  abort: noop,
  toggle: noop,
};

export function ChatDictationButtonDictationStates() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Three states of a dictation interaction
      </Text>
      <Stack direction="horizontal" gap={6}>
        <Stack direction="vertical" gap={1}>
          <ChatDictationButton dictation={idle} />
          <Text variant="small" color="secondary">
            Idle
          </Text>
        </Stack>
        <Stack direction="vertical" gap={1}>
          <ChatDictationButton dictation={listening} />
          <Text variant="small" color="secondary">
            Listening
          </Text>
        </Stack>
        <Stack direction="vertical" gap={1}>
          <ChatDictationButton dictation={speaking} />
          <Text variant="small" color="secondary">
            Speaking
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
