'use client';

import {useState} from 'react';
import {Selector, SelectorOption} from '@tecton/react/Selector';
import {InputGroup} from '@tecton/react/InputGroup';
import {Button} from '@tecton/react/Button';
import {Stack} from '@tecton/react/Layout';
import {LockIcon, MapIcon} from '@tecton/react/icons';

const VISIBILITY = [
  {
    value: 'private',
    label: 'Private',
    icon: LockIcon,
    description: 'Only members can access this space and its content.',
  },
  {
    value: 'public',
    label: 'Public',
    icon: MapIcon,
    description: 'Anyone at the company can find and join this space.',
  },
];

export function SelectorOptionDescriptions() {
  const [condensed, setCondensed] = useState<string | undefined>('private');
  const [full, setFull] = useState<string | undefined>('private');
  const [grouped, setGrouped] = useState<string | undefined>('private');

  return (
    <Stack direction="vertical" gap={6}>
      <Selector
        style={{width: 320}}
        label="Visibility"
        description="Default trigger: one line at the size token."
        options={VISIBILITY}
        value={condensed}
        onChange={setCondensed}
      />
      <Selector
        style={{width: 320}}
        label="Visibility"
        description="A stacked SelectorOption: the description gets its own line, and the trigger grows by exactly one line."
        options={VISIBILITY}
        value={full}
        onChange={setFull}
        renderValue={option => (
          <SelectorOption
            icon={option.icon}
            label={option.label ?? option.value}
            description={option.description}
          />
        )}
      />
      <InputGroup label="Visibility">
        <Selector
          label="Visibility"
          isLabelHidden
          options={VISIBILITY}
          value={grouped}
          onChange={setGrouped}
          renderValue={option => (
            <SelectorOption
              icon={option.icon}
              label={option.label ?? option.value}
              description={option.description}
            />
          )}
        />
        <Button label="Save" />
      </InputGroup>
    </Stack>
  );
}
