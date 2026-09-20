'use client';

import {AppShell} from '@tecton/react/AppShell';
import {VStack} from '@tecton/react/Stack';
import {Heading, Text} from '@tecton/react/Text';
import {TopNav, TopNavHeading, TopNavItem} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {SideNav, SideNavItem, SideNavSection} from '@tecton/react/SideNav';
import {
  CubeIcon,
  FolderIcon,
  HomeIcon,
  PersonIcon,
  ReportsAnalyticsIcon,
  SettingsIcon,
} from '@tecton/react/icons';

export function AppShellTopNavWithSideNav() {
  return (
    <AppShell
      contentPadding={6}
      style={{height: '100%', minHeight: 0}}
      topNav={
        <TopNav
          label="Main navigation"
          heading={
            <TopNavHeading
              heading="App Shell"
              logo={
                <NavIcon icon={<CubeIcon style={{width: 16, height: 16}} />} />
              }
            />
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
            <SideNavItem
              label="Dashboard"
              icon={HomeIcon}
              isSelected
              href="#"
            />
            <SideNavItem
              label="Analytics"
              icon={ReportsAnalyticsIcon}
              href="#"
            />
            <SideNavItem label="Projects" icon={FolderIcon} href="#" />
          </SideNavSection>
          <SideNavSection title="Organization">
            <SideNavItem label="Team" icon={PersonIcon} href="#" />
            <SideNavItem label="Settings" icon={SettingsIcon} href="#" />
          </SideNavSection>
        </SideNav>
      }
    >
      <VStack gap={4}>
        <Heading level={3}>Page Content</Heading>
        <Text type="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </Text>
      </VStack>
    </AppShell>
  );
}
