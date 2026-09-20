import {useState} from 'react';
import {Card} from '../../Card/Card.js';
import {Switch} from '../Switch.js';
import {VStack} from '../../VStack/VStack.js';

export function SwitchSettingsPanel() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <Card width="100%">
      <VStack gap={4}>
        <Switch
          label="Enable notifications"
          value={notifications}
          onChange={setNotifications}
          labelPosition="start"
        />
        <Switch
          label="Dark mode"
          value={darkMode}
          onChange={setDarkMode}
          labelPosition="start"
        />
        <Switch
          label="Auto-save"
          value={autoSave}
          onChange={setAutoSave}
          labelPosition="start"
        />
      </VStack>
    </Card>
  );
}
