'use client';

import {Item} from '@tecton/react/Item';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ItemBasicItem() {
  return (
    <Stack gap={0}>
      <Item
        label="Quarterly planning"
        description="Agenda, notes, and action items"
        endContent={<Text color="secondary">Today</Text>}
      />
      <Item
        label="Customer research"
        description="Interview notes from the latest study"
        endContent={<Text color="secondary">Yesterday</Text>}
      />
      <Item
        label="Launch checklist"
        description="Remaining tasks before release"
        endContent={<Text color="secondary">Fri</Text>}
      />
    </Stack>
  );
}
