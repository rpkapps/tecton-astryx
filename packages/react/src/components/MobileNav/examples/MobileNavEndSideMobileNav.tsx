import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {MobileNav} from '../MobileNav.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';

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
          <SideNavItem label="General" icon="settings" href="/settings" />
          <SideNavItem label="Team" icon="person" href="/team" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
