import {useState} from 'react';
import {Badge} from '../../Badge/Badge.js';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../Tabs.js';

export function TabsTabsWithBadge() {
  const [value, setValue] = useState('inbox');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab
        value="inbox"
        label="Inbox"
        endContent={<Badge variant="error" label="5" />}
      />
      <Tab value="sent" label="Sent" />
      <Tab
        value="drafts"
        label="Drafts"
        endContent={<Badge variant="neutral" label="2" />}
      />
    </Tabs>
  );
}
