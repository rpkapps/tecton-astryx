'use client';

/**
 * A component's props, as the doc beside it declares them.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/PropsTable.tsx`: required props first, the
 * default folded into the type column, and the description rendered as the
 * Markdown it was authored as.
 */

import {HStack, VStack} from '@tecton/react/Layout';
import {Section} from '@tecton/react/Section';
import {Table, pixel, proportional} from '@tecton/react/Table';
import {Badge} from '@tecton/react/Badge';
import {Text} from '@tecton/react/Text';
import type {DocProp} from '@/types/docs';
import {MarkdownText} from './MarkdownText';

function formatType(type: string, defaultValue?: string): string {
  return defaultValue != null ? `${type} (default: ${defaultValue})` : type;
}

export function PropsTable({props}: {props: readonly DocProp[]}) {
  if (props.length === 0) return null;

  const required = props.filter(prop => prop.required);
  const optional = props.filter(prop => !prop.required);
  const data = [...required, ...optional].map(prop => ({
    name: prop.name as unknown,
    required: prop.required as unknown,
    type: formatType(prop.type, prop.default) as unknown,
    description: (prop.description ?? '') as unknown,
  })) as Record<string, unknown>[];

  return (
    <Section>
      <VStack gap={2}>
        <Table
          data={data}
          columns={[
            {
              key: 'name',
              header: 'Prop',
              width: pixel(180),
              renderCell: (item: Record<string, unknown>) => (
                <HStack gap={1} vAlign="center">
                  <Text type="code" weight="bold">
                    {item.name as string}
                  </Text>
                  {item.required === true && (
                    <Badge label="required" variant="info" />
                  )}
                </HStack>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              width: pixel(240),
              renderCell: (item: Record<string, unknown>) => (
                <Text type="code" color="secondary">
                  {item.type as string}
                </Text>
              ),
            },
            {
              key: 'description',
              header: 'Description',
              width: proportional(1, {minWidth: 220}),
              renderCell: (item: Record<string, unknown>) => (
                <MarkdownText type="body">
                  {item.description as string}
                </MarkdownText>
              ),
            },
          ]}
          density="spacious"
          dividers="rows"
        />
      </VStack>
    </Section>
  );
}
