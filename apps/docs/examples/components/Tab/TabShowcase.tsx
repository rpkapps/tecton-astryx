'use client';

import {useState} from 'react';
import {TabList, Tab} from '@tecton/react/TabList';
import {Badge} from '@tecton/react/Badge';

export function TabShowcase() {
  const [value, setValue] = useState('inbox');
  return (
    <TabList value={value} onChange={setValue}>
      <Tab
        value="inbox"
        label="Inbox"
        endContent={<Badge label="3" variant="info" />}
      />
    </TabList>
  );
}
