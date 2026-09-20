'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {
  CubeIcon,
  HomeIcon,
  NotificationsIcon,
  ReportsAnalyticsIcon,
} from '@tecton/react/icons';

export function TopNavEnterpriseDashboard() {
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
          <TopNavItem
            label="Dashboard"
            href="#"
            isSelected
            icon={<Icon icon={HomeIcon} size="sm" />}
          />
          <TopNavItem
            label="Reports"
            href="#"
            icon={<Icon icon={ReportsAnalyticsIcon} size="sm" />}
          />
        </>
      }
      endContent={
        <>
          <Button
            label="Search"
            variant="ghost"
            icon={<Icon icon="search" color="inherit" />}
            isIconOnly
          />
          <Button
            label="Notifications"
            variant="ghost"
            icon={<Icon icon={NotificationsIcon} />}
            isIconOnly
          />
          <Button label="Upgrade" variant="primary" />
        </>
      }
    />
  );
}
