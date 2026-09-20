'use client';

/**
 * How a component is restyled.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/Theming.tsx`: the targets a `defineTheme`
 * config keys on, a copyable example of that config, and the custom properties
 * the component reads — private ones marked as such rather than hidden, because
 * a reader meets them in DevTools either way.
 *
 * The class names in these tables are the library's own (`astryx-button`), and
 * they stay that way: they are the selectors the component actually carries.
 */

import {VStack} from '@tecton/react/Layout';
import {Banner} from '@tecton/react/Banner';
import {Badge} from '@tecton/react/Badge';
import {Card} from '@tecton/react/Card';
import {Table, pixel, proportional} from '@tecton/react/Table';
import {Heading, Text} from '@tecton/react/Text';
import type {
  ComponentVar,
  DocProp,
  ThemingDoc,
  ThemingTarget,
} from '@/types/docs';
import {CodeBlock} from './CodeBlock';
import {MarkdownText} from './MarkdownText';
import {
  buildDefineThemeExample,
  configKey,
  publicVars,
  targetDataAttributes,
  targetPropValues,
} from './themingHelpers';

function list(values: string[]) {
  return values.length > 0 ? (
    <Text type="code" color="secondary">
      {values.join(', ')}
    </Text>
  ) : (
    <Text color="secondary">—</Text>
  );
}

function TargetsTable({
  targets,
  props,
}: {
  targets: readonly ThemingTarget[];
  props: readonly DocProp[];
}) {
  const data = targets.map(target => ({
    key: configKey(target) as unknown,
    className: target.className as unknown,
    status: (target.deprecatedFor
      ? `Deprecated: use ${target.deprecatedFor}`
      : 'Current') as unknown,
    dataAttrs: targetDataAttributes(target) as unknown,
    props: targetPropValues(target, props) as unknown,
    states: (target.states ?? []) as unknown,
  })) as Record<string, unknown>[];

  return (
    <Card>
      <Table
        data={data}
        columns={[
          {
            key: 'key',
            header: 'Config key',
            width: pixel(160),
            renderCell: (item: Record<string, unknown>) => (
              <Text type="code" weight="bold">
                {item.key as string}
              </Text>
            ),
          },
          {
            key: 'className',
            header: 'Class',
            width: pixel(180),
            renderCell: (item: Record<string, unknown>) => (
              <Text type="code" color="secondary">
                .{item.className as string}
              </Text>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            width: pixel(150),
            renderCell: (item: Record<string, unknown>) => (
              <Text color="secondary">{item.status as string}</Text>
            ),
          },
          {
            key: 'dataAttrs',
            header: 'Data attributes',
            width: proportional(1.4, {minWidth: 160}),
            renderCell: (item: Record<string, unknown>) =>
              list((item.dataAttrs as string[]).map(attr => `[${attr}]`)),
          },
          {
            key: 'props',
            header: 'Props',
            width: proportional(1.2, {minWidth: 140}),
            renderCell: (item: Record<string, unknown>) =>
              list(item.props as string[]),
          },
          {
            key: 'states',
            header: 'States',
            width: proportional(1, {minWidth: 120}),
            renderCell: (item: Record<string, unknown>) =>
              list(item.states as string[]),
          },
        ]}
        density="spacious"
        dividers="rows"
      />
    </Card>
  );
}

function CssVarsTable({vars}: {vars: readonly ComponentVar[]}) {
  const data = vars.map(entry => ({
    name: entry.name as unknown,
    private: (entry.private === true) as unknown,
    default: (entry.default ?? '—') as unknown,
    description: (entry.description ?? '') as unknown,
  })) as Record<string, unknown>[];

  return (
    <Card>
      <Table
        data={data}
        columns={[
          {
            key: 'name',
            header: 'CSS variable',
            width: pixel(240),
            renderCell: (item: Record<string, unknown>) => (
              <Text type="code" weight="bold">
                {item.name as string}
              </Text>
            ),
          },
          {
            key: 'private',
            header: 'Scope',
            width: pixel(110),
            renderCell: (item: Record<string, unknown>) =>
              item.private === true ? (
                <Badge label="private" variant="neutral" />
              ) : (
                <Badge label="public" variant="info" />
              ),
          },
          {
            key: 'default',
            header: 'Default',
            width: pixel(220),
            renderCell: (item: Record<string, unknown>) => (
              <Text type="code" color="secondary">
                {item.default as string}
              </Text>
            ),
          },
          {
            key: 'description',
            header: 'Description',
            width: proportional(1, {minWidth: 200}),
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
    </Card>
  );
}

export function Theming({
  theming,
  props,
}: {
  theming: ThemingDoc;
  props: readonly DocProp[];
}) {
  const hasTargets = theming.targets.length > 0;
  const vars = publicVars(theming);
  if (!hasTargets && vars.length === 0) return null;

  const example = hasTargets ? buildDefineThemeExample(theming) : '';

  return (
    <VStack gap={6}>
      {theming.container === true && (
        <Banner
          container="card"
          status="info"
          title="A theming container"
          description="Components rendered inside this one read their surface and content colours from it, so theming it restyles what it contains as well as itself."
        />
      )}

      <Text type="large" weight="normal">
        Restyle this component from a <Text type="code">defineTheme</Text>{' '}
        config: target it through the keys below, or override the custom
        properties it reads.
      </Text>

      {hasTargets && (
        <VStack gap={4}>
          <Heading level={3}>Theme targets</Heading>
          <Text color="secondary">
            Each target is a key in the <Text type="code">components</Text> map
            of <Text type="code">defineTheme</Text>. Scope a rule to a prop or
            state with a <Text type="code">prop:value</Text> or state key; use{' '}
            <Text type="code">base</Text> for every instance.
          </Text>
          <TargetsTable targets={theming.targets} props={props} />
          {example && <CodeBlock code={example} label="defineTheme config" />}
        </VStack>
      )}

      {vars.length > 0 && (
        <VStack gap={4}>
          <Heading level={3}>Themeable CSS variables</Heading>
          <Text color="secondary">
            The custom properties this component reads. Override them in the{' '}
            <Text type="code">base</Text> block of its config. A private one is
            internal to the component — it is listed because it is visible in
            DevTools, not because it is part of the contract.
          </Text>
          <CssVarsTable vars={vars} />
        </VStack>
      )}
    </VStack>
  );
}
