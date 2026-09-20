'use client';

import {Breadcrumbs, BreadcrumbItem} from '@tecton/react/Breadcrumbs';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function BreadcrumbsSupportingVariant() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Default
        </Text>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem isCurrent>My Project</BreadcrumbItem>
        </Breadcrumbs>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
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
