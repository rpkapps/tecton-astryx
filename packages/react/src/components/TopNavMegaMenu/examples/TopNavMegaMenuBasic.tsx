import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMegaMenu} from '../TopNavMegaMenu.js';
import {TopNavMegaMenuItem} from '../../TopNavMegaMenuItem/TopNavMegaMenuItem.js';

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
                  icon="play"
                  href="#deploy"
                />
                <TopNavMegaMenuItem
                  title="Documentation"
                  description="Guides, references, and tutorials"
                  icon="reports-analytics"
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
