'use client';

import {OverflowList} from '@tecton/react/OverflowList';
import {Button} from '@tecton/react/Button';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {Card} from '@tecton/react/Card';
import {Center} from '@tecton/react/Center';

const actions = ['Save', 'Edit', 'Duplicate', 'Share', 'Archive', 'Delete'];

export function OverflowListCappedToolbar() {
  return (
    <Center width={420}>
      <Card padding={2}>
        <OverflowList
          gap={2}
          maxVisibleItems={3}
          overflowRenderer={overflowItems => (
            <DropdownMenu
              button={{
                label: `+${overflowItems.length}`,
                variant: 'ghost',
                size: 'sm',
              }}
              items={overflowItems.map(({index}) => ({
                label: actions[index],
              }))}
            />
          )}
        >
          {actions.map(action => (
            <Button key={action} label={action} size="sm" />
          ))}
        </OverflowList>
      </Card>
    </Center>
  );
}
