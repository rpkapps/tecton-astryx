import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {ChatComposer} from '../ChatComposer.js';
import {ChatComposerDrawer} from '../../ChatComposerDrawer/ChatComposerDrawer.js';
import {ChatComposerInput} from '../../ChatComposerInput/ChatComposerInput.js';
import {Chip} from '../../Chip/Chip.js';
import {Icon} from '../../Icon/Icon.js';
import {Menu} from '../../Menu/Menu.js';
import {Progress} from '../../Progress/Progress.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatComposerFullFeatured() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <Text variant="small" color="secondary">
        All slots populated
      </Text>
      <ChatComposer
        onSubmit={value => {
          console.log('Sent:', value);
          setIsStreaming(true);
          setTimeout(() => setIsStreaming(false), 3000);
        }}
        isStopShown={isStreaming}
        onStop={() => setIsStreaming(false)}
        placeholder="Ask me anything..."
        input={<ChatComposerInput style={{minHeight: 44}} />}
        drawer={
          <ChatComposerDrawer count={5}>
            <Chip label="design-spec.pdf" onRemove={() => {}} />
            <Chip label="requirements.docx" onRemove={() => {}} />
            <Chip label="wireframes.fig" onRemove={() => {}} />
            <Chip label="api-spec.yaml" onRemove={() => {}} />
            <Chip label="user-research.csv" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <>
            <Button
              label="Mention"
              variant="tertiary"
              size="sm"
              icon={<Icon name={'link'} />}
            />
            <Button
              label="Attach file"
              variant="tertiary"
              size="sm"
              icon={<Icon name={'link'} />}
            />
          </>
        }
        headerContext={
          <Progress label="Context window" value={50} isLabelHidden />
        }
        footerActions={
          <>
            <Menu
              button={{
                label: 'Auto',
                variant: 'ghost',
                size: 'md',
                icon: <Icon name={'robot-2'} size={16} />,
                children: 'Auto',
              }}
              menuWidth={200}
              items={[
                {label: 'Auto', onClick: () => {}},
                {label: 'Model A', onClick: () => {}},
                {label: 'Model B', onClick: () => {}},
                {label: 'Model C', onClick: () => {}},
              ]}
            />
            <Menu
              button={{
                label: 'Settings',
                variant: 'ghost',
                size: 'md',
                icon: <Icon name={'settings'} size={16} />,
                children: 'Settings',
              }}
              menuWidth={200}
              items={[
                {label: 'Preferences', onClick: () => {}},
                {label: 'Keyboard shortcuts', onClick: () => {}},
                {label: 'About', onClick: () => {}},
              ]}
            />
          </>
        }
        sendActions={
          <Button
            label="Microphone"
            variant="tertiary"
            size="md"
            icon={<Icon name={'microphone'} />}
          />
        }
      />
    </Stack>
  );
}
