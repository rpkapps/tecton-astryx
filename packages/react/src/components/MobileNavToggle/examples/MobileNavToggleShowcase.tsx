import {useState} from 'react';
import {HStack} from '../../HStack/HStack.js';
import {MobileNav} from '../../MobileNav/MobileNav.js';
import {MobileNavToggle} from '../MobileNavToggle.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';
import {Text} from '../../Text/Text.js';
import {AppShellMobileContext} from '../../../support/index.js';

export function MobileNavToggleShowcase() {
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
      <HStack gap={3}>
        <MobileNavToggle />
        <Text variant="medium" weight="bold">
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
