'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
} from '@tecton/react/TopNav';
import {
  CodeIcon,
  LockIcon,
  PlayIcon,
  ReportsAnalyticsIcon,
  SearchIcon,
} from '@tecton/react/icons';

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
                  icon={<PlayIcon width={20} height={20} />}
                  href="#deploy"
                />
                <TopNavMegaMenuItem
                  title="Documentation"
                  description="Guides, references, and tutorials"
                  icon={<ReportsAnalyticsIcon width={20} height={20} />}
                  href="#docs"
                />
                <TopNavMegaMenuItem
                  title="API"
                  description="Programmatic access to all features"
                  icon={<CodeIcon width={20} height={20} />}
                  href="#api"
                />
                <TopNavMegaMenuItem
                  title="Security"
                  description="Enterprise-grade protection"
                  icon={<LockIcon width={20} height={20} />}
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
      endContent={<SearchIcon width={20} height={20} />}
    />
  );
}
