'use client';

import {Item} from '@tecton/react/Item';
import {Avatar} from '@tecton/react/Avatar';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/Icon';
import {Text} from '@tecton/react/Text';
import {Stack} from '@tecton/react/Layout';
import {
  NotificationsIcon,
  PersonIcon,
  ReportsAnalyticsIcon,
} from '@tecton/react/icons';

export function ItemShowcase() {
  return (
    <Stack gap={0}>
      <Item
        startContent={<Avatar name="Alice Johnson" size={40} />}
        label="Alice Johnson"
        description="Engineering Lead"
        endContent={<Badge label="Admin" />}
        onClick={() => {}}
      />
      <Item
        startContent={<Icon icon={NotificationsIcon} size="sm" />}
        label="Build completed successfully"
        description="Pipeline #4521 — all 42 tests passed"
        endContent={<Text color="secondary">5h ago</Text>}
        descriptionLines={1}
        onClick={() => {}}
      />
      <Item
        startContent={<Icon icon={ReportsAnalyticsIcon} size="sm" />}
        label="design-spec.pdf"
        description="Modified 2 hours ago"
        endContent={<Text color="secondary">2.4 MB</Text>}
        isSelected
        onClick={() => {}}
      />
      <Item
        startContent={<Icon icon={PersonIcon} size="sm" />}
        label="Compact menu item"
        density="compact"
        onClick={() => {}}
      />
    </Stack>
  );
}
