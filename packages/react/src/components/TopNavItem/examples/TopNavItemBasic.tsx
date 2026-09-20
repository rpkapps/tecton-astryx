import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../TopNavItem.js';

export function TopNavItemBasic() {
  return (
    <TopNav
      label="Main navigation"
      heading={<TopNavHeading heading="App" />}
      startContent={
        <>
          <TopNavItem label="Dashboard" href="#" isSelected />
          <TopNavItem label="Projects" href="#" />
          <TopNavItem label="Reports" href="#" />
        </>
      }
    />
  );
}
