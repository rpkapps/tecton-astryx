'use client';

import {useState} from 'react';
import {
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerInput,
} from '@tecton/react/Chat';
import {Token} from '@tecton/react/Token';
import {Button} from '@tecton/react/Button';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {Icon} from '@tecton/react/Icon';
import {ProgressBar} from '@tecton/react/ProgressBar';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {
  LinkIcon,
  MicrophoneIcon,
  Robot2Icon,
  SettingsIcon,
} from '@tecton/react/icons';

export function ChatComposerFullFeatured() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <Text type="supporting" color="secondary">
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
            <Token label="design-spec.pdf" onRemove={() => {}} />
            <Token label="requirements.docx" onRemove={() => {}} />
            <Token label="wireframes.fig" onRemove={() => {}} />
            <Token label="api-spec.yaml" onRemove={() => {}} />
            <Token label="user-research.csv" onRemove={() => {}} />
          </ChatComposerDrawer>
        }
        headerActions={
          <>
            <Button
              label="Mention"
              variant="ghost"
              size="sm"
              icon={<Icon icon={LinkIcon} />}
              isIconOnly
            />
            <Button
              label="Attach file"
              variant="ghost"
              size="sm"
              icon={<Icon icon={LinkIcon} />}
              isIconOnly
            />
          </>
        }
        headerContext={
          <ProgressBar label="Context window" value={50} isLabelHidden />
        }
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
  );
}
