'use client';

import {OverflowList} from '@tecton/react/OverflowList';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Center} from '@tecton/react/Center';

export function OverflowListCollapseFromStartList() {
  return (
    <Center width={300}>
      <Card padding={2}>
        <OverflowList
          gap={2}
          collapseFrom="start"
          overflowRenderer={overflowItems => (
            <Button
              label={`+${overflowItems.length} more`}
              variant="ghost"
              size="sm"
            />
          )}
        >
          <Button label="Step 1" size="sm" />
          <Button label="Step 2" size="sm" />
          <Button label="Step 3" size="sm" />
          <Button label="Step 4" size="sm" />
          <Button label="Step 5" size="sm" />
        </OverflowList>
      </Card>
    </Center>
  );
}
