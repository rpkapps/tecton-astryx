import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {MobileNav} from '../MobileNav.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';

export function MobileNavBasicMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open Navigation"
        icon={<Icon name="menu" />}
        variant="tertiary"
        onClick={() => setIsOpen(true)}
      />
      <MobileNav
        isOpen={isOpen}
        onOpenChange={open => setIsOpen(open)}
        header="Navigation"
      >
        <SideNavSection title="Main">
          <SideNavItem
            label="Dashboard"
            icon={'home'}
            isSelected
            href="/dashboard"
          />
          <SideNavItem label="Projects" icon={'folder'} href="/projects" />
          <SideNavItem
            label="Analytics"
            icon={'reports-analytics'}
            href="/analytics"
          />
        </SideNavSection>
        <SideNavSection title="Settings">
          <SideNavItem label="General" icon={'settings'} href="/settings" />
          <SideNavItem label="Team" icon={'person'} href="/team" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
