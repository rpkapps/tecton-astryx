import {AppShell} from '../AppShell.js';
import {Heading} from '../../Heading/Heading.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {SideNav} from '../../SideNav/SideNav.js';
import {SideNavHeading} from '../../SideNavHeading/SideNavHeading.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function AppShellShowcase() {
  return (
    <AppShell
      contentPadding={6}
      style={{height: '100%', minHeight: 0, width: '100%'}}
      sideNav={
        <SideNav
          header={
            <SideNavHeading
              icon={<NavIcon icon="cube" />}
              heading="App Shell"
              headingHref="#"
            />
          }
        >
          <SideNavSection title="Main" isHeaderHidden>
            <SideNavItem label="Home" icon="home" isSelected href="#" />
            <SideNavItem label="Reports" icon="reports-analytics" href="#" />
            <SideNavItem label="Documents" icon="reports-analytics" href="#" />
            <SideNavItem label="Team" icon="person" href="#" />
          </SideNavSection>
        </SideNav>
      }
    >
      <VStack gap={4}>
        <Heading level={3}>Page Content</Heading>
        <Text variant="medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </Text>
      </VStack>
    </AppShell>
  );
}
