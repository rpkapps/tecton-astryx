import {Alert} from '../../Alert/Alert.js';
import {AppShell} from '../AppShell.js';
import {Heading} from '../../Heading/Heading.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {SideNav} from '../../SideNav/SideNav.js';
import {SideNavItem} from '../../SideNavItem/SideNavItem.js';
import {SideNavSection} from '../../SideNavSection/SideNavSection.js';
import {Text} from '../../Text/Text.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {VStack} from '../../VStack/VStack.js';

export function AppShellWithBanner() {
  return (
    <AppShell
      contentPadding={6}
      style={{height: '100%', minHeight: 0}}
      topNav={
        <TopNav
          label="Main navigation"
          heading={
            <TopNavHeading heading="App Shell" logo={<NavIcon icon="cube" />} />
          }
          startContent={
            <>
              <TopNavItem label="Home" href="#" isSelected />
              <TopNavItem label="Products" href="#" />
              <TopNavItem label="Docs" href="#" />
            </>
          }
        />
      }
      sideNav={
        <SideNav>
          <SideNavSection title="Main" isHeaderHidden>
            <SideNavItem label="Dashboard" icon="home" isSelected href="#" />
            <SideNavItem label="Analytics" icon="reports-analytics" href="#" />
            <SideNavItem label="Projects" icon="folder" href="#" />
          </SideNavSection>
          <SideNavSection title="Organization">
            <SideNavItem label="Team" icon="person" href="#" />
            <SideNavItem label="Settings" icon="settings" href="#" />
          </SideNavSection>
        </SideNav>
      }
      banner={
        <Alert
          status="info"
          title="System maintenance scheduled"
          description="The system will undergo maintenance tonight at 10pm UTC."
          isDismissable
        />
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
