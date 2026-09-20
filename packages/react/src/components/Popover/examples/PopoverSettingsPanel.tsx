import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {Heading} from '../../Heading/Heading.js';
import {Popover} from '../Popover.js';
import {Switch} from '../../Switch/Switch.js';
import {VStack} from '../../VStack/VStack.js';

export function PopoverSettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds, setSounds] = useState(true);

  return (
    <Popover
      placement="below"
      label="Settings"
      width={280}
      content={
        <VStack gap={3}>
          <Heading level={4}>Settings</Heading>
          <Divider />
          <Switch
            label="Notifications"
            description="Receive push notifications"
            value={notifications}
            onChange={setNotifications}
          />
          <Switch
            label="Dark mode"
            description="Use dark color theme"
            value={darkMode}
            onChange={setDarkMode}
          />
          <Switch
            label="Sounds"
            description="Play sounds for actions"
            value={sounds}
            onChange={setSounds}
          />
        </VStack>
      }
    >
      <Button label="Settings" label="Settings" />
    </Popover>
  );
}
