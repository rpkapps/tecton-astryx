'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {
  CodeIcon,
  CubeIcon,
  ElectricityIcon,
  LockIcon,
  PersonIcon,
  ReportsAnalyticsIcon,
} from '@tecton/react/icons';

export function TopNavHoverMenu() {
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
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavMenu
            label="Products"
            items={[
              {
                title: 'Analytics',
                description: 'Track and analyze user behavior',
                icon: <ReportsAnalyticsIcon />,
                href: '#analytics',
              },
              {
                title: 'Security',
                description: 'Enterprise-grade protection',
                icon: <LockIcon />,
                href: '#security',
              },
              {
                title: 'Automation',
                description: 'Streamline your workflows',
                icon: <ElectricityIcon />,
                href: '#automation',
              },
              {
                title: 'Developer Tools',
                description: 'APIs, SDKs, and CLI tools',
                icon: <CodeIcon />,
                href: '#dev-tools',
              },
            ]}
          />
          <TopNavItem label="Pricing" href="#" />
        </>
      }
      endContent={
        <Button
          label="Profile"
          variant="ghost"
          icon={<PersonIcon />}
          isIconOnly
        />
      }
    />
  );
}
