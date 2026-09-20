import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
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
          logo={<NavIcon icon={<Icon name={'cube'} size={16} />} />}
          headingHref="#"
        />
      }
      startContent={
        <>
          <TopNavItem
            label="Dashboard"
            href="#"
            isSelected
            icon={<Icon name={'home'} size={16} />}
          />
          <TopNavItem
            label="Reports"
            href="#"
            icon={<Icon name={'reports-analytics'} size={16} />}
          />
        </>
      }
      endContent={
        <>
          <Button
            label="Search"
            variant="tertiary"
            icon={<Icon name="search" />}
          />
          <Button
            label="Notifications"
            variant="tertiary"
            icon={<Icon name={'notifications'} />}
          />
          <Button label="Upgrade" variant="primary" />
        </>
      }
    />
  );
}
