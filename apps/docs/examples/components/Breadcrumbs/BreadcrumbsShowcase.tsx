'use client';

import {Breadcrumbs, BreadcrumbItem} from '@tecton/react/Breadcrumbs';

export function BreadcrumbsShowcase() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
      <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
    </Breadcrumbs>
  );
}
