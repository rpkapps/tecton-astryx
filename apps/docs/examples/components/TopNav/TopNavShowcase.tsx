'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {CubeIcon, NotificationsIcon, PersonIcon} from '@tecton/react/icons';

export function TopNavShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
        />
      }
      startContent={
        <>
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavItem label="Products" href="#" />
          <TopNavItem label="About" href="#" />
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
            icon={<NotificationsIcon />}
            isIconOnly
          />
          <Button
            label="Profile"
            variant="ghost"
            icon={<PersonIcon />}
            isIconOnly
          />
        </>
      }
    />
  );
}
