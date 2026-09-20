import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {TabMenu} from '../TabMenu.js';
import {Tabs} from '../../Tabs/Tabs.js';

export function TabMenuBasic() {
  const [value, setValue] = useState('overview');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab value="overview" label="Overview" />
      <Tab value="activity" label="Activity" />
      <TabMenu
        label="More"
        options={[
          {value: 'settings', label: 'Settings'},
          {value: 'billing', label: 'Billing'},
        ]}
      />
    </Tabs>
  );
}
