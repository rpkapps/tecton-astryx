'use client';

import {Breadcrumbs, BreadcrumbItem} from '@tecton/react/Breadcrumbs';

export function BreadcrumbItemBasic() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
    </Breadcrumbs>
  );
}
