'use client';

import {useState} from 'react';
import {ChatComposer, ChatComposerDrawer} from '@tecton/react/Chat';
import {List, ListItem} from '@tecton/react/List';
import {Text} from '@tecton/react/Text';
import {Badge} from '@tecton/react/Badge';
import {Stack} from '@tecton/react/Layout';

const options = [
  {key: 'A', label: 'Yes'},
  {key: 'B', label: 'Yes, and don\u2019t ask again for `git add` commands'},
  {key: 'C', label: 'No, and tell me what to do differently'},
];

export function ChatComposerDrawerFeedback() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => {
          console.log('Submit:', value, '| Answer:', selected);
        }}
        drawer={
          <ChatComposerDrawer count={1} label="User feedback requested">
            <Stack direction="vertical" gap={1} width="100%">
              <List>
                <ListItem
                  label={<Text weight="bold">Do you want to proceed?</Text>}
                />
                {options.map(opt => (
                  <ListItem
                    key={opt.key}
                    label={opt.label}
                    startContent={
                      <Badge
                        variant={selected === opt.key ? 'info' : 'neutral'}
                        label={opt.key}
                      />
                    }
                    isSelected={selected === opt.key}
                    onClick={() => setSelected(opt.key)}
                  />
                ))}
              </List>
            </Stack>
          </ChatComposerDrawer>
        }
      />
    </Stack>
  );
}
