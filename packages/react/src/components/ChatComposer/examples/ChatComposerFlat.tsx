import {Button} from '../../Button/Button.js';
import {ChatComposer} from '../ChatComposer.js';
import {Icon} from '../../Icon/Icon.js';
import {Menu} from '../../Menu/Menu.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatComposerFlat() {
  return (
    <Stack direction="vertical" gap={2} width={450} maxWidth="100%">
      <Text variant="small" color="secondary">
        elevation=&quot;none&quot; — flat, with a text-input-style border and
        focus ring
      </Text>
      <ChatComposer
        elevation="none"
        onSubmit={value => {
          console.log('Sent:', value);
        }}
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
