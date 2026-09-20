'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {CubeIcon, PersonIcon} from '@tecton/react/icons';

export function TopNavWithLogo() {
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
          <TopNavItem label="Overview" href="#" isSelected />
          <TopNavItem label="Analytics" href="#" />
          <TopNavItem label="Reports" href="#" />
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
