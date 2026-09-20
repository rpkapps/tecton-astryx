'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {
  CodeIcon,
  CubeIcon,
  ElectricityIcon,
  LockIcon,
  MapIcon,
  ReportsAnalyticsIcon,
} from '@tecton/react/icons';

export function TopNavMegaMenuBlock() {
  return (
    <TopNav
      label="Marketing navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
          headingHref="#"
        />
      }
      startContent={
        <>
          <TopNavMegaMenu
            label="Products"
            items={
              <>
                <TopNavMegaMenuItem
                  title="Analytics"
                  description="Track and analyze user behavior across your apps"
                  icon={<ReportsAnalyticsIcon />}
                  href="#analytics"
                />
                <TopNavMegaMenuItem
                  title="Security"
                  description="Enterprise-grade protection for your data"
                  icon={<LockIcon />}
                  href="#security"
                />
                <TopNavMegaMenuItem
                  title="Automation"
                  description="Streamline workflows with intelligent tools"
                  icon={<ElectricityIcon />}
                  href="#automation"
                />
                <TopNavMegaMenuItem
                  title="Developer Tools"
                  description="APIs, SDKs, and CLI for integration"
                  icon={<CodeIcon />}
                  href="#dev-tools"
                />
                <TopNavMegaMenuItem
                  title="Global Network"
                  description="Low-latency edge infra in 40+ regions"
                  icon={<MapIcon />}
                  href="#network"
                />
              </>
            }
            featured={
              <TopNavMegaMenuFeaturedCard
                title="What's new in v4.0"
                description="AI-powered analytics and real-time collaboration."
                image="/template-assets/light-working-horizontal-1.png"
                imageAlt="Team collaboration"
                linkLabel="Read the announcement"
                linkHref="#announcement"
              />
            }
          />
          <TopNavItem label="Pricing" href="#" />
          <TopNavItem label="Docs" href="#" />
        </>
      }
      endContent={
        <>
          <Button label="Sign in" variant="ghost" />
          <Button label="Get started" variant="primary" />
        </>
      }
    />
  );
}
