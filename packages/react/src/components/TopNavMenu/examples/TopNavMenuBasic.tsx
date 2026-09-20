import {Icon} from '../../Icon/Icon.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMenu} from '../TopNavMenu.js';

export function TopNavMenuBasic() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
      heading={<TopNavHeading heading="Platform" />}
      startContent={
        <>
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavMenu
            label="Tools"
            items={[
              {
                title: 'Analytics',
                description: 'View traffic and engagement metrics',
                icon: <Icon name="reports-analytics" />,
                href: '#analytics',
              },
              {
                title: 'Settings',
                description: 'Configure your workspace',
                icon: <Icon name="settings" />,
                href: '#settings',
              },
            ]}
          />
        </>
      }
    />
  );
}
