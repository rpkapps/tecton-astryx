import {Button} from '../../Button/Button.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {TopNav} from '../TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMegaMenu} from '../../TopNavMegaMenu/TopNavMegaMenu.js';
import {TopNavMegaMenuFeaturedCard} from '../../TopNavMegaMenuFeaturedCard/TopNavMegaMenuFeaturedCard.js';
import {TopNavMegaMenuItem} from '../../TopNavMegaMenuItem/TopNavMegaMenuItem.js';

export function TopNavMegaMenuBlock() {
  return (
    <TopNav
      label="Marketing navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon="cube" />}
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
                  icon="reports-analytics"
                  href="#analytics"
                />
                <TopNavMegaMenuItem
                  title="Security"
                  description="Enterprise-grade protection for your data"
                  icon="lock"
                  href="#security"
                />
                <TopNavMegaMenuItem
                  title="Automation"
                  description="Streamline workflows with intelligent tools"
                  icon="electricity"
                  href="#automation"
                />
                <TopNavMegaMenuItem
                  title="Developer Tools"
                  description="APIs, SDKs, and CLI for integration"
                  icon="code"
                  href="#dev-tools"
                />
                <TopNavMegaMenuItem
                  title="Global Network"
                  description="Low-latency edge infra in 40+ regions"
                  icon="map"
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
          <Button label="Sign in" variant="tertiary" />
          <Button label="Get started" variant="primary" />
        </>
      }
    />
  );
}
