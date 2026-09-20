'use client';

import {ChatComposer, ChatComposerDrawer} from '@tecton/react/Chat';
import {Token} from '@tecton/react/Token';
import {ProgressBar} from '@tecton/react/ProgressBar';
import {Stack} from '@tecton/react/Layout';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {LinkIcon} from '@tecton/react/icons';

export function ChatComposerDrawerWithProgress() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        drawer={
          <ChatComposerDrawer count={3} label="Attachments">
            <Token label="design-spec.pdf" onRemove={() => {}} />
            <Token label="api-schema.json" onRemove={() => {}} />
            <Token label="screenshot.png" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <>
            <Button
              label="Mention"
              variant="ghost"
              size="sm"
              icon={<Icon icon={LinkIcon} size="sm" />}
              isIconOnly
              onClick={() => {}}
            />
            <Button
              label="Attach"
              variant="ghost"
              size="sm"
              icon={<Icon icon={LinkIcon} size="sm" />}
              isIconOnly
              onClick={() => {}}
            />
          </>
        }
        headerContext={
          <Stack direction="horizontal" gap={2} vAlign="center">
            <ProgressBar value={42} label="Context usage" isLabelHidden />
          </Stack>
        }
      />
    </Stack>
  );
}
