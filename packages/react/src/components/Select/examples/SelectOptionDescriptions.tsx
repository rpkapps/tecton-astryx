import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {InputGroup} from '../../InputGroup/InputGroup.js';
import {Select} from '../Select.js';
import {SelectChoice} from '../../SelectChoice/SelectChoice.js';
import {Stack} from '../../Stack/Stack.js';

const VISIBILITY = [
  {
    value: 'private',
    label: 'Private',
    icon: 'lock',
    description: 'Only members can access this space and its content.',
  },
  {
    value: 'public',
    label: 'Public',
    icon: 'map',
    description: 'Anyone at the company can find and join this space.',
  },
];

export function SelectOptionDescriptions() {
  const [condensed, setCondensed] = useState<string | undefined>('private');
  const [full, setFull] = useState<string | undefined>('private');
  const [grouped, setGrouped] = useState<string | undefined>('private');

  return (
    <Stack direction="vertical" gap={6}>
      <Select
        label="Visibility"
        description="Default trigger: one line at the size token."
        options={VISIBILITY}
        value={condensed}
        onChange={setCondensed}
      />
      <Select
        label="Visibility"
        description="A stacked SelectorOption: the description gets its own line, and the trigger grows by exactly one line."
        options={VISIBILITY}
        value={full}
        onChange={setFull}
        renderValue={option => (
          <SelectChoice
            icon={option.icon}
            label={option.label ?? option.value}
            description={option.description}
          />
        )}
      />
      <InputGroup label="Visibility">
        <Select
          label="Visibility"
          isLabelHidden
          options={VISIBILITY}
          value={grouped}
          onChange={setGrouped}
          renderValue={option => (
            <SelectChoice
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
