'use client';

import {useState} from 'react';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {Icon} from '@tecton/react/Icon';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {MoreVertIcon} from '@tecton/react/icons';

export function DropdownMenuNoChevron() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <DropdownMenu
        button={{
          label: 'More actions',
          icon: <Icon icon={MoreVertIcon} />,
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
        <Text type="supporting" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
