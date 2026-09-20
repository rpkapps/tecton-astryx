'use client';

import {Breadcrumbs, BreadcrumbItem} from '@tecton/react/Breadcrumbs';
import {Icon} from '@tecton/react/Icon';
import {HomeIcon} from '@tecton/react/icons';

export function BreadcrumbsDeepHierarchy() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/" startIcon={<Icon icon={HomeIcon} size="sm" />}>
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
