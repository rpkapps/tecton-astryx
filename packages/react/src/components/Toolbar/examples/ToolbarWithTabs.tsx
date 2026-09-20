import {useState, type CSSProperties} from 'react';
import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Icon} from '../../Icon/Icon.js';
import {Section} from '../../Section/Section.js';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../../Tabs/Tabs.js';
import {Toolbar} from '../Toolbar.js';

const card: CSSProperties = {
  width: '100%',
  maxWidth: 500,
  height: '100%',
  marginTop: 200,
};

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
        endContent={<Button label="New item" icon={<Icon name={'add'} />} />}
      />
      <Section />
    </Card>
  );
}
