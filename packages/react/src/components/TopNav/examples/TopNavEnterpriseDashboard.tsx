import {Button} from '../../Button/Button.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {TopNav} from '../TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';

export function TopNavEnterpriseDashboard() {
  return (
    <TopNav
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon="cube" />}
          headingHref="#"
        />
      }
      startContent={
        <>
          <TopNavItem label="Dashboard" href="#" isSelected icon="home" />
          <TopNavItem label="Reports" href="#" icon="reports-analytics" />
        </>
      }
      endContent={
        <>
          <Button label="Search" variant="tertiary" icon="search" />
          <Button
            label="Notifications"
            variant="tertiary"
            icon="notifications"
          />
          <Button label="Upgrade" variant="primary" />
        </>
      }
    />
  );
}
