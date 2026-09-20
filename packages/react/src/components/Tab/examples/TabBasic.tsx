import {useState} from 'react';
import {Tabs} from '../../Tabs/Tabs.js';
import {Tab} from '../Tab.js';

export function TabBasic() {
  const [tab, setTab] = useState('overview');

  return (
    <Tabs value={tab} onChange={setTab}>
      <Tab
        value="overview"
        label="Overview"
        icon="home"
        panelId="overview-panel"
      />
      <Tab value="wells" label="Wells" icon="well" panelId="wells-panel" />
    </Tabs>
  );
}
