import {AppShell} from '../AppShell.js';
import {Heading} from '../../Heading/Heading.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {Text} from '../../Text/Text.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {VStack} from '../../VStack/VStack.js';

export function AppShellTopNavOnly() {
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
