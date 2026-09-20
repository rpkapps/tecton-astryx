'use client';

import {ChatComposer, ChatComposerDrawer} from '@tecton/react/Chat';
import {Token} from '@tecton/react/Token';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {LinkIcon} from '@tecton/react/icons';
import type {CSSProperties} from 'react';

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
            <Token label="design-spec.pdf" onRemove={() => {}} />
            <Token label="api-schema.json" onRemove={() => {}} />
            <Token label="screenshot.png" onRemove={() => {}} />
            <Token label="meeting-notes.md" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <Button
            label="Attach"
            variant="ghost"
            size="sm"
            icon={<Icon icon={LinkIcon} size="sm" />}
            isIconOnly
            onClick={() => {}}
          />
        }
      />
    </Stack>
  );
}
