'use client';

import {useState} from 'react';
import {MobileNav} from '@tecton/react/MobileNav';
import {SideNavSection, SideNavItem} from '@tecton/react/SideNav';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {FolderIcon, HomeIcon} from '@tecton/react/icons';

export function MobileNavWithoutTitleMobileNav() {
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
      <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
        <SideNavSection title="Main">
          <SideNavItem
            label="Dashboard"
            icon={HomeIcon}
            isSelected
            href="/dashboard"
          />
          <SideNavItem label="Projects" icon={FolderIcon} href="/projects" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
