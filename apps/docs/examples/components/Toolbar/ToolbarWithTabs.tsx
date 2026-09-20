'use client';

import {useState, type CSSProperties} from 'react';
import {Toolbar} from '@tecton/react/Toolbar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {TabList, Tab} from '@tecton/react/TabList';
import {Card} from '@tecton/react/Card';
import {Section} from '@tecton/react/Section';
import {AddIcon} from '@tecton/react/icons';

const card: CSSProperties = {
  width: '100%',
  maxWidth: 500,
  height: '100%',
  marginTop: 200,
};

export function ToolbarWithTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <Card style={card}>
      <Toolbar
        label="Section navigation"
        dividers={['bottom']}
        startContent={
          <TabList value={tab} onChange={setTab}>
            <Tab value="overview" label="Overview" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="settings" label="Settings" />
          </TabList>
        }
        endContent={
          <Button label="New item" icon={<Icon icon={AddIcon} />} isIconOnly />
        }
      />
      <Section />
    </Card>
  );
}
