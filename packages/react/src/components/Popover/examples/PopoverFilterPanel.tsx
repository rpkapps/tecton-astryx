import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {Divider} from '../../Divider/Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Popover} from '../Popover.js';
import {VStack} from '../../VStack/VStack.js';

export function PopoverFilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    active: true,
    archived: false,
    drafts: true,
    shared: false,
  });

  const toggle = (key: keyof typeof filters) =>
    setFilters(prev => ({...prev, [key]: !prev[key]}));

  return (
    <Popover
      placement="below"
      label="Filter"
      width={240}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      content={
        <VStack gap={3}>
          <Heading level={4}>Filter by status</Heading>
          <Divider />
          <Checkbox
            label="Active"
            value={filters.active}
            onChange={() => toggle('active')}
          />
          <Checkbox
            label="Archived"
            value={filters.archived}
            onChange={() => toggle('archived')}
          />
          <Checkbox
            label="Drafts"
            value={filters.drafts}
            onChange={() => toggle('drafts')}
          />
          <Checkbox
            label="Shared with me"
            value={filters.shared}
            onChange={() => toggle('shared')}
          />
          <Divider />
          <HStack gap={2}>
            <Button
              label="Apply"
              variant="primary"
              onClick={() => setIsOpen(false)}
              label="Apply"
            />
            <Button
              label="Reset"
              variant="tertiary"
              onClick={() =>
                setFilters({
                  active: true,
                  archived: false,
                  drafts: true,
                  shared: false,
                })
              }
              label="Reset"
            />
          </HStack>
        </VStack>
      }
    >
      <Button label="Filter" label="Filter" />
    </Popover>
  );
}
