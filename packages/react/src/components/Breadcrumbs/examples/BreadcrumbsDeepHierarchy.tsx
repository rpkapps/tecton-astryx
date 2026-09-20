import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';
import {Icon} from '../../Icon/Icon.js';

export function BreadcrumbsDeepHierarchy() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/" startIcon={<Icon name={'home'} size={16} />}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics/phones">
        Phones
      </BreadcrumbItem>
      <BreadcrumbItem isCurrent>iPhone 15 Pro</BreadcrumbItem>
    </Breadcrumbs>
  );
}
