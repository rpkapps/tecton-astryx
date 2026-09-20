'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Button} from '@tecton/react/Button';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {MicrophoneIcon, Robot2Icon, SettingsIcon} from '@tecton/react/icons';

export function ChatComposerFlat() {
  return (
    <Stack direction="vertical" gap={2} width={450} maxWidth="100%">
      <Text type="supporting" color="secondary">
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
            <DropdownMenu
              button={{
                label: 'Auto',
                variant: 'ghost',
                size: 'md',
                icon: <Icon icon={Robot2Icon} size="sm" />,
                children: 'Auto',
              }}
              menuWidth={200}
              items={[
                {label: 'Auto', onClick: () => {}},
                {label: 'Model A', onClick: () => {}},
                {label: 'Model B', onClick: () => {}},
              ]}
            />
            <DropdownMenu
              button={{
                label: 'Settings',
                variant: 'ghost',
                size: 'md',
                icon: <Icon icon={SettingsIcon} size="sm" />,
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
            variant="ghost"
            size="md"
            icon={<Icon icon={MicrophoneIcon} />}
            isIconOnly
          />
        }
      />
    </Stack>
  );
}
