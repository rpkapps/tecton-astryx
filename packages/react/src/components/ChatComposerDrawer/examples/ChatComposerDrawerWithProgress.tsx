import {Button} from '../../Button/Button.js';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerDrawer} from '../ChatComposerDrawer.js';
import {Chip} from '../../Chip/Chip.js';
import {Icon} from '../../Icon/Icon.js';
import {Progress} from '../../Progress/Progress.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatComposerDrawerWithProgress() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        drawer={
          <ChatComposerDrawer count={3} label="Attachments">
            <Chip label="design-spec.pdf" onRemove={() => {}} />
            <Chip label="api-schema.json" onRemove={() => {}} />
            <Chip label="screenshot.png" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <>
            <Button
              label="Mention"
              variant="tertiary"
              size="sm"
              icon={<Icon name={'link'} size={16} />}
              onClick={() => {}}
            />
            <Button
              label="Attach"
              variant="tertiary"
              size="sm"
              icon={<Icon name={'link'} size={16} />}
              onClick={() => {}}
            />
          </>
        }
        headerContext={
          <Stack direction="horizontal" gap={2}>
            <Progress value={42} label="Context usage" isLabelHidden />
          </Stack>
        }
      />
    </Stack>
  );
}
