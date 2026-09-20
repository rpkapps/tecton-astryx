'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@tecton/react/TopNav';
import {Button} from '@tecton/react/Button';
import {
  PersonIcon,
  ReportsAnalyticsIcon,
  SearchIcon,
  SettingsIcon,
} from '@tecton/react/icons';

export function TopNavMenuShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Menu demo"
      heading={<TopNavHeading heading="Platform" />}
      startContent={
        <>
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavMenu
            label="Tools"
            items={[
              {
                title: 'Analytics',
                description: 'View traffic and engagement metrics',
                icon: <ReportsAnalyticsIcon />,
                href: '#analytics',
              },
              {
                title: 'Team Members',
                description: 'Manage your team and permissions',
                icon: <PersonIcon />,
                href: '#team',
              },
              {
                title: 'Settings',
                description: 'Configure your workspace',
                icon: <SettingsIcon />,
                href: '#settings',
              },
            ]}
          />
        </>
      }
      endContent={
        <Button
          label="Search"
          variant="ghost"
          icon={<SearchIcon />}
          isIconOnly
        />
      }
    />
  );
}
