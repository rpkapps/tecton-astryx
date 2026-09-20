'use client';

import {useState} from 'react';
import {MobileNav} from '@tecton/react/MobileNav';
import {SideNavSection, SideNavItem} from '@tecton/react/SideNav';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {
  FolderIcon,
  HomeIcon,
  PersonIcon,
  ReportsAnalyticsIcon,
  SettingsIcon,
} from '@tecton/react/icons';

export function MobileNavBasicMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open Navigation"
        icon={<Icon icon="menu" color="inherit" />}
        variant="ghost"
        onClick={() => setIsOpen(true)}
        isIconOnly
      />
      <MobileNav
        isOpen={isOpen}
        onOpenChange={open => setIsOpen(open)}
        header="Navigation"
      >
        <SideNavSection title="Main">
          <SideNavItem
            label="Dashboard"
            icon={HomeIcon}
            isSelected
            href="/dashboard"
          />
          <SideNavItem label="Projects" icon={FolderIcon} href="/projects" />
          <SideNavItem
            label="Analytics"
            icon={ReportsAnalyticsIcon}
            href="/analytics"
          />
        </SideNavSection>
        <SideNavSection title="Settings">
          <SideNavItem label="General" icon={SettingsIcon} href="/settings" />
          <SideNavItem label="Team" icon={PersonIcon} href="/team" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
