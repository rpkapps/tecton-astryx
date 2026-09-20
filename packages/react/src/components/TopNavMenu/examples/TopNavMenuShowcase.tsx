import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../../TopNavHeading/TopNavHeading.js';
import {TopNavItem} from '../../TopNavItem/TopNavItem.js';
import {TopNavMenu} from '../TopNavMenu.js';

export function TopNavMenuShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Menu demo"
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
                title: 'Team Members',
                description: 'Manage your team and permissions',
                icon: <Icon name="person" />,
                href: '#team',
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
      endContent={<Button label="Search" variant="tertiary" icon="search" />}
    />
  );
}
