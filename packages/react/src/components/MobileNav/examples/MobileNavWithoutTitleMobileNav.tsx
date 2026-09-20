import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {MobileNav} from '../MobileNav.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';

export function MobileNavWithoutTitleMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open Navigation"
        icon={<Icon name="menu" />}
        variant="tertiary"
        onClick={() => setIsOpen(true)}
      />
      <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
        <SideNavSection title="Main">
          <SideNavItem
            label="Dashboard"
            icon={'home'}
            isSelected
            href="/dashboard"
          />
          <SideNavItem label="Projects" icon={'folder'} href="/projects" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
