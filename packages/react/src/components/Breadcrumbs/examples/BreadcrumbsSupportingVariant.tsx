import {BreadcrumbItem} from '../../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from '../Breadcrumbs.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function BreadcrumbsSupportingVariant() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Default
        </Text>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
        </Breadcrumbs>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Supporting
        </Text>
        <Breadcrumbs variant="supporting">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
        </Breadcrumbs>
      </Stack>
    </Stack>
  );
}
