import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';

export function BreadcrumbsWithIcons() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
    </Breadcrumbs>
  );
}
