import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';

export function BreadcrumbsBasic() {
  return (
    <Breadcrumbs label="Project">
      <BreadcrumbItem href="#" icon="home">
        Projects
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Troll West</BreadcrumbItem>
      <BreadcrumbItem href="#">FDA 1.02</BreadcrumbItem>
      <BreadcrumbItem>Facies model</BreadcrumbItem>
    </Breadcrumbs>
  );
}
