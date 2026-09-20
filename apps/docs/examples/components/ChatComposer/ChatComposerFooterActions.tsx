'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Button} from '@tecton/react/Button';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {MicrophoneIcon, Robot2Icon, SettingsIcon} from '@tecton/react/icons';

export function ChatComposerFooterActions() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Model selector and settings dropdowns
        </Text>
        <ChatComposer
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
                  {label: 'Model C', onClick: () => {}},
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
    </Stack>
  );
}
