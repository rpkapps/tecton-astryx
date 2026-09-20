'use client';

import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
} from '@tecton/react/TopNav';
import {PlayIcon, ReportsAnalyticsIcon} from '@tecton/react/icons';

export function TopNavMegaMenuBasic() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
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
              </>
            }
          />
        </>
      }
    />
  );
}
