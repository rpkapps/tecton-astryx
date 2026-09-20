import {useState} from 'react';
import {StatusDot} from '../../StatusDot/StatusDot.js';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../Tabs.js';

export function TabsTabsWithStatusDot() {
  const [value, setValue] = useState('production');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab
        value="production"
        label="Production"
        endContent={<StatusDot variant="success" label="Healthy" />}
      />
      <Tab
        value="staging"
        label="Staging"
        endContent={<StatusDot variant="warning" label="Degraded" />}
      />
      <Tab value="development" label="Development" />
    </Tabs>
  );
}
