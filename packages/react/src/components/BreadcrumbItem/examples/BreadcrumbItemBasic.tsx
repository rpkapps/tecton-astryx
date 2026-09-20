import {Breadcrumbs} from '../../Breadcrumbs/Breadcrumbs.js';
import {BreadcrumbItem} from '../BreadcrumbItem.js';

export function BreadcrumbItemBasic() {
  return (
    <Breadcrumbs label="Project">
      <BreadcrumbItem href="#" icon="folder">
        Troll West
      </BreadcrumbItem>
      <BreadcrumbItem>Horizons</BreadcrumbItem>
    </Breadcrumbs>
  );
}
