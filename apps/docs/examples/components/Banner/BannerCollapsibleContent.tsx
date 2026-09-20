'use client';

import {Banner} from '@tecton/react/Banner';
import {Button} from '@tecton/react/Button';
import {List, ListItem} from '@tecton/react/List';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function BannerCollapsibleContent() {
  return (
    <Banner
      status="warning"
      title="Configuration changes detected"
      description="Review the changes before they take effect."
      endContent={<Button label="Review" variant="secondary" size="sm" />}
      isDismissable
      collapsible={{defaultIsOpen: true}}
    >
      <Stack direction="vertical" gap={2}>
        <Text type="supporting" color="secondary">
          Changed settings:
        </Text>
        <List density="compact">
          <ListItem label="Authentication method updated" />
          <ListItem label="Rate limits modified" />
        </List>
      </Stack>
    </Banner>
  );
}
