import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {TopNav} from '../TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMenu} from '../../TopNavMenu/TopNavMenu.js';

export function TopNavHoverMenu() {
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
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavMenu
            label="Products"
            items={[
              {
                title: 'Analytics',
                description: 'Track and analyze user behavior',
                icon: <Icon name="reports-analytics" />,
                href: '#analytics',
              },
              {
                title: 'Security',
                description: 'Enterprise-grade protection',
                icon: <Icon name="lock" />,
                href: '#security',
              },
              {
                title: 'Automation',
                description: 'Streamline your workflows',
                icon: <Icon name="electricity" />,
                href: '#automation',
              },
              {
                title: 'Developer Tools',
                description: 'APIs, SDKs, and CLI tools',
                icon: <Icon name="code" />,
                href: '#dev-tools',
              },
            ]}
          />
          <TopNavItem label="Pricing" href="#" />
        </>
      }
      endContent={<Button label="Profile" variant="tertiary" icon="person" />}
    />
  );
}
