'use client';

/**
 * A hook's parameters and what it hands back.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/HookSignature.tsx`, minus the inline type
 * definition popovers — the vendored docs carry no extracted declarations for
 * them to open.
 */

import {HStack, VStack} from '@tecton/react/Layout';
import {Section} from '@tecton/react/Section';
import {Table, pixel, proportional} from '@tecton/react/Table';
import {Badge} from '@tecton/react/Badge';
import {Heading, Text} from '@tecton/react/Text';
import type {HookParamDoc, HookReturnDoc} from '@/types/docs';
import {MarkdownText} from './MarkdownText';

function formatParamType(type: string, defaultValue?: string): string {
  return defaultValue != null ? `${type} (default: ${defaultValue})` : type;
}

function descriptionColumn() {
  return {
    key: 'description',
    header: 'Description',
    width: proportional(1, {minWidth: 220}),
    renderCell: (item: Record<string, unknown>) => (
      <MarkdownText type="body">{item.description as string}</MarkdownText>
    ),
  };
}

export function HookSignature({
  params,
  returns,
}: {
  params: readonly HookParamDoc[];
  returns: readonly HookReturnDoc[];
}) {
  const paramData = params.map(param => ({
    name: param.name as unknown,
    required: param.required as unknown,
    type: formatParamType(param.type, param.default) as unknown,
    description: (param.description ?? '') as unknown,
  })) as Record<string, unknown>[];

  const returnData = returns.map(entry => ({
    name: entry.name as unknown,
    type: entry.type as unknown,
    description: (entry.description ?? '') as unknown,
  })) as Record<string, unknown>[];

  return (
    <VStack gap={6}>
      {params.length > 0 && (
        <Section>
          <VStack gap={2}>
            <Heading level={3}>Parameters</Heading>
            <Table
              data={paramData}
              columns={[
                {
                  key: 'name',
                  header: 'Param',
                  width: pixel(240),
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
                descriptionColumn(),
              ]}
              density="spacious"
              dividers="rows"
            />
          </VStack>
        </Section>
      )}
      {returns.length > 0 && (
        <Section>
          <VStack gap={2}>
            <Heading level={3}>Returns</Heading>
            <Table
              data={returnData}
              columns={[
                {
                  key: 'name',
                  header: 'Field',
                  width: pixel(220),
                  renderCell: (item: Record<string, unknown>) => (
                    <Text type="code" weight="bold">
                      {item.name as string}
                    </Text>
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
                descriptionColumn(),
              ]}
              density="spacious"
              dividers="rows"
            />
          </VStack>
        </Section>
      )}
    </VStack>
  );
}
