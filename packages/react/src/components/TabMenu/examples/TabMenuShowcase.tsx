import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {TabMenu} from '../TabMenu.js';
import {Tabs} from '../../Tabs/Tabs.js';

export function TabMenuShowcase() {
  const [value, setValue] = useState('settings');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab value="overview" label="Overview" />
      <Tab value="activity" label="Activity" />
      <TabMenu
        label="More"
        options={[
          {value: 'settings', label: 'Settings'},
          {value: 'integrations', label: 'Integrations'},
          {value: 'billing', label: 'Billing'},
        ]}
      />
    </Tabs>
  );
}
