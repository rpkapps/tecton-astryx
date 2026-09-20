import {useState} from 'react';
import {Tab} from '../../Tab/Tab.js';
import {Tabs} from '../Tabs.js';

export function TabsShowcase() {
  const [value, setValue] = useState('home');
  return (
    <Tabs value={value} onChange={setValue}>
      <Tab value="home" label="Home" />
      <Tab value="projects" label="Projects" />
      <Tab value="settings" label="Settings" />
    </Tabs>
  );
}
