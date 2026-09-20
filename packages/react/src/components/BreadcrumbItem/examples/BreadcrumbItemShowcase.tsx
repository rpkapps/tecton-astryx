import {BreadcrumbItem} from '../BreadcrumbItem.js';
import {Breadcrumbs} from '../../Breadcrumbs/Breadcrumbs.js';
import {Icon} from '../../Icon/Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function BreadcrumbItemShowcase() {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <Text variant="small" color="secondary">
          With start icon
        </Text>
        <Breadcrumbs>
          <BreadcrumbItem href="/" startIcon={<Icon name={'home'} size={16} />}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Components</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>
      <VStack gap={1}>
        <Text variant="small" color="secondary">
          As current page (non-link)
        </Text>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>
      <VStack gap={1}>
        <Text variant="small" color="secondary">
          Supporting variant
        </Text>
        <Breadcrumbs variant="supporting">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/admin">Admin</BreadcrumbItem>
          <BreadcrumbItem href="/admin/users">Users</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Permissions</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>
      <VStack gap={1}>
        <Text variant="small" color="secondary">
          With onClick handler (no href)
        </Text>
        <Breadcrumbs>
          <BreadcrumbItem onClick={() => {}}>Dashboard</BreadcrumbItem>
          <BreadcrumbItem onClick={() => {}}>Projects</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Project Alpha</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>
    </VStack>
  );
}
