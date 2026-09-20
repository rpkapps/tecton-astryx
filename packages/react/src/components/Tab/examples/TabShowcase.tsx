import {useState} from 'react';
import {Badge} from '../../Badge/Badge.js';
import {Tab} from '../Tab.js';
import {Tabs} from '../../Tabs/Tabs.js';

export function TabShowcase() {
  const [value, setValue] = useState('inbox');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab
        value="inbox"
        label="Inbox"
        endContent={<Badge label="3" variant="info" />}
      />
    </Tabs>
  );
}
