import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../Tabs.js';

export function TabsBasic() {
  const [tab, setTab] = useState('overview');

  return (
    <>
      <Tabs value={tab} onChange={setTab} hasDivider>
        <Tab value="overview" label="Overview" panelId="tabs-overview" />
        <Tab value="framing" label="Framing" panelId="tabs-framing" />
        <Tab value="analytics" label="Analytics" panelId="tabs-analytics" />
      </Tabs>
      <div id={`tabs-${tab}`} role="tabpanel" />
    </>
  );
}
