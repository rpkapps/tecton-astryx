'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Icon} from '@tecton/react/Icon';
import {CubeIcon, LockIcon, ReportsAnalyticsIcon} from '@tecton/react/icons';

export function TopNavMultipleDropdowns() {
  return (
    <TopNav
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
          headingHref="#"
        />
      }
      startContent={
        <>
          <TopNavMenu
            label="Products"
            items={[
              {
                title: 'Analytics',
                description: 'Track behavior',
                icon: <ReportsAnalyticsIcon />,
                href: '#',
              },
              {
                title: 'Security',
                description: 'Enterprise protection',
                icon: <LockIcon />,
                href: '#',
              },
            ]}
          />
          <TopNavMenu
            label="Resources"
            items={[
              {title: 'Documentation', href: '#'},
              {title: 'API Reference', href: '#'},
              {title: 'Community Forum', href: '#'},
            ]}
          />
          <TopNavItem label="Pricing" href="#" />
        </>
      }
    />
  );
}
