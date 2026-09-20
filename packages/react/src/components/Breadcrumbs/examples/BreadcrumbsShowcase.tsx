import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';

export function BreadcrumbsShowcase() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
      <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
    </Breadcrumbs>
  );
}
