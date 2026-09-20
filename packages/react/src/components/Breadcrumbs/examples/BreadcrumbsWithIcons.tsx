import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';
import {Icon} from '../../Icon/Icon.js';

export function BreadcrumbsWithIcons() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/" startIcon={<Icon name={'home'} size={16} />}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem
        href="/settings"
        startIcon={<Icon name={'settings'} size={16} />}
      >
        Settings
      </BreadcrumbItem>
      <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
    </Breadcrumbs>
  );
}
