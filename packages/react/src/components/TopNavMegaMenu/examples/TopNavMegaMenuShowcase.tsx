import {Icon} from '../../Icon/Icon.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMegaMenu} from '../TopNavMegaMenu.js';
import {TopNavMegaMenuFeaturedCard} from '../../TopNavMegaMenuFeaturedCard/TopNavMegaMenuFeaturedCard.js';
import {TopNavMegaMenuItem} from '../../TopNavMegaMenuItem/TopNavMegaMenuItem.js';

export function TopNavMegaMenuShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Mega menu demo"
      heading={<TopNavHeading heading="DevTools" />}
      startContent={
        <>
          <TopNavItem label="Overview" href="#" isSelected />
          <TopNavMegaMenu
            label="Products"
            items={
              <>
                <TopNavMegaMenuItem
                  title="Deploy"
                  description="Ship to production in seconds"
                  icon="play"
                  href="#deploy"
                />
                <TopNavMegaMenuItem
                  title="Documentation"
                  description="Guides, references, and tutorials"
                  icon="reports-analytics"
                  href="#docs"
                />
                <TopNavMegaMenuItem
                  title="API"
                  description="Programmatic access to all features"
                  icon="code"
                  href="#api"
                />
                <TopNavMegaMenuItem
                  title="Security"
                  description="Enterprise-grade protection"
                  icon="lock"
                  href="#security"
                />
              </>
            }
            featured={
              <TopNavMegaMenuFeaturedCard
                title="What's New"
                description="Check out our latest features and improvements in the Q2 release."
                linkLabel="Read the changelog"
                linkHref="#changelog"
              />
            }
          />
        </>
      }
      endContent={<Icon name="search" />}
    />
  );
}
