import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerDrawer} from '../ChatComposerDrawer.js';
import {Chip} from '../../Chip/Chip.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerDrawerCollapsible() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        drawer={
          <ChatComposerDrawer count={6} label="Files">
            <Chip label="design-spec.pdf" onRemove={() => {}} />
            <Chip label="api-schema.json" onRemove={() => {}} />
            <Chip label="screenshot.png" onRemove={() => {}} />
            <Chip label="meeting-notes.md" onRemove={() => {}} />
            <Chip label="test-results.csv" onRemove={() => {}} />
            <Chip label="deploy-log.txt" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
      />
    </Stack>
  );
}
