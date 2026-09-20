import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {MobileNav} from '../MobileNav.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';

export function MobileNavShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open Navigation"
        icon={<Icon name="menu" />}
        variant="tertiary"
        onClick={() => setIsOpen(true)}
      />
      <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Navigation">
        <SideNavSection title="Main">
          <SideNavItem label="Dashboard" isSelected href="/dashboard" />
          <SideNavItem label="Projects" href="/projects" />
          <SideNavItem label="Analytics" href="/analytics" />
        </SideNavSection>
        <SideNavSection title="Settings">
          <SideNavItem label="General" href="/settings" />
          <SideNavItem label="Team" href="/team" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
