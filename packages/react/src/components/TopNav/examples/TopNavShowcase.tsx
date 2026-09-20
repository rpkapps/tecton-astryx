import {Button} from '../../Button/Button.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {TopNav} from '../TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';

export function TopNavShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
      heading={
        <TopNavHeading heading="My App" logo={<NavIcon icon="cube" />} />
      }
      startContent={
        <>
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavItem label="Products" href="#" />
          <TopNavItem label="About" href="#" />
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
          <Button label="Profile" variant="tertiary" icon="person" />
        </>
      }
    />
  );
}
