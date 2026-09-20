'use client';

import {useState} from 'react';
import {MobileNav, MobileNavToggle} from '@tecton/react/MobileNav';
import {AppShellMobileContext} from '@tecton/react/AppShell';
import {SideNavItem, SideNavSection} from '@tecton/react/SideNav';
import {Icon} from '@tecton/react/Icon';
import {HStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function MobileNavToggleBasic() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AppShellMobileContext.Provider
      value={{
        isMobile: true,
        isMobileNavOpen: isOpen,
        toggleMobileNav: () => setIsOpen(v => !v),
        openMobileNav: () => setIsOpen(true),
        closeMobileNav: () => setIsOpen(false),
        isMobileNavEnabled: true,
        hasAutoToggle: false,
      }}
    >
      <HStack gap={3} vAlign="center">
        <MobileNavToggle label="Open menu">
          <Icon icon="viewColumns" />
        </MobileNavToggle>
        <Text type="body" weight="bold">
          Page title
        </Text>
      </HStack>
      <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Navigation">
        <SideNavSection title="Pages">
          <SideNavItem label="Home" isSelected href="#" />
          <SideNavItem label="Settings" href="#" />
        </SideNavSection>
      </MobileNav>
    </AppShellMobileContext.Provider>
  );
}
