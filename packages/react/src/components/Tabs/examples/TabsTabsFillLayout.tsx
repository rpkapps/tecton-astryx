import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../Tabs.js';

export function TabsTabsFillLayout() {
  const [value, setValue] = useState('home');
  return (
    <div style={{width: 500}}>
      <Tabs value={value} onChange={setValue} layout="fill" hasDivider>
        <Tab value="home" label="Home" />
        <Tab value="projects" label="Projects" />
        <Tab value="settings" label="Settings" />
      </Tabs>
    </div>
  );
}
