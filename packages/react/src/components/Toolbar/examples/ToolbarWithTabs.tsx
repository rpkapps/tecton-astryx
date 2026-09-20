import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Section} from '../../Section/Section.js';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../../Tabs/Tabs.js';
import {Toolbar} from '../Toolbar.js';

export function ToolbarWithTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <Card>
      <Toolbar
        label="Section navigation"
        dividers={['bottom']}
        startContent={
          <Tabs value={tab} onChange={setTab}>
            <Tab value="overview" label="Overview" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="settings" label="Settings" />
          </Tabs>
        }
        endContent={<Button label="New item" icon="add" />}
      />
      <Section />
    </Card>
  );
}
