'use client';

import {useState} from 'react';
import {MobileNav} from '@tecton/react/MobileNav';
import {SideNavSection, SideNavItem} from '@tecton/react/SideNav';
import {Button} from '@tecton/react/Button';
import {PersonIcon, SettingsIcon} from '@tecton/react/icons';

export function MobileNavEndSideMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button label="Open from Right" onClick={() => setIsOpen(true)} />
      <MobileNav
        isOpen={isOpen}
        onOpenChange={open => setIsOpen(open)}
        header="Settings"
        side="end"
      >
        <SideNavSection title="Settings">
          <SideNavItem label="General" icon={SettingsIcon} href="/settings" />
          <SideNavItem label="Team" icon={PersonIcon} href="/team" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
