'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@tecton/react/TopNav';
import {ReportsAnalyticsIcon, SettingsIcon} from '@tecton/react/icons';

export function TopNavMenuBasic() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
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
                title: 'Settings',
                description: 'Configure your workspace',
                icon: <SettingsIcon />,
                href: '#settings',
              },
            ]}
          />
        </>
      }
    />
  );
}
