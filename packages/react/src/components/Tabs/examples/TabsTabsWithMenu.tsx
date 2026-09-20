import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {TabMenu} from '../../TabMenu/TabMenu.js';
import {Tabs} from '../Tabs.js';

export function TabsTabsWithMenu() {
  const [value, setValue] = useState('home');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab value="home" label="Home" />
      <Tab value="projects" label="Projects" />
      <TabMenu
        label="More"
        options={[
          {value: 'analytics', label: 'Analytics'},
          {value: 'reports', label: 'Reports'},
          {value: 'billing', label: 'Billing'},
        ]}
      />
    </Tabs>
  );
}
