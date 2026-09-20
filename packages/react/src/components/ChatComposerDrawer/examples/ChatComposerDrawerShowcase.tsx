import type {CSSProperties} from 'react';
import {Button} from '../../Button/Button.js';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerDrawer} from '../ChatComposerDrawer.js';
import {Chip} from '../../Chip/Chip.js';
import {Stack} from '../../Stack/Stack.js';

const drawerBorder: CSSProperties = {
  border: 'var(--border-width) solid var(--color-border)',
  borderTopLeftRadius: 'var(--radius-chat)',
  borderTopRightRadius: 'var(--radius-chat)',
};

export function ChatComposerDrawerShowcase() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        drawer={
          <ChatComposerDrawer
            count={4}
            label="Attachments"
            style={drawerBorder}
          >
            <Chip label="design-spec.pdf" onRemove={() => {}} />
            <Chip label="api-schema.json" onRemove={() => {}} />
            <Chip label="screenshot.png" onRemove={() => {}} />
            <Chip label="meeting-notes.md" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <Button
            label="Attach"
            variant="tertiary"
            size="sm"
            icon="link"
            onClick={() => {}}
          />
        }
      />
    </Stack>
  );
}
