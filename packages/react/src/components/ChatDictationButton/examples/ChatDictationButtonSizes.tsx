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

const listeningDictation: UseSpeechRecognitionReturn = {
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

export function ChatDictationButtonSizes() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Small
        </Text>
        <Stack direction="horizontal" gap={4}>
          <ChatDictationButton dictation={idleDictation} size="sm" />
          <ChatDictationButton dictation={listeningDictation} size="sm" />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Medium
        </Text>
        <Stack direction="horizontal" gap={4}>
          <ChatDictationButton dictation={idleDictation} size="md" />
          <ChatDictationButton dictation={listeningDictation} size="md" />
        </Stack>
      </Stack>
    </Stack>
  );
}
