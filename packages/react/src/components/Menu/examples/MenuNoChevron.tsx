import {useState} from 'react';
import {Icon} from '../../Icon/Icon.js';
import {Menu} from '../Menu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function MenuNoChevron() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <Menu
        button={{
          label: 'More actions',
          icon: <Icon name={'more-vert'} />,
          variant: 'ghost',
          isIconOnly: true,
        }}
        hasChevron={false}
        items={[
          {label: 'Copy link', onClick: () => setLastAction('Copy link')},
          {label: 'Download', onClick: () => setLastAction('Download')},
          {label: 'Print', onClick: () => setLastAction('Print')},
          {type: 'divider'},
          {label: 'Report', onClick: () => setLastAction('Report')},
        ]}
      />
      {lastAction && (
        <Text variant="small" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
