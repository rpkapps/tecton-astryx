'use client';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {Chip, HStack, Icon, Table, Text} from '@tecton/react';
import {componentRegistry} from '@/generated/componentRegistry';
import type {
  ComponentDoc,
  DocAccessibilityRow,
  DocAnatomyPart,
  DocProp,
  DocThemingTarget,
} from '@/types/docs';

function find(name: string): ComponentDoc | undefined {
  return componentRegistry.find(entry => entry.name === name);
}

function Unknown({name}: {name: string}) {
  return (
    <p className="text-sm" style={{color: 'var(--color-error)'}}>
      No component named <code>{name}</code> is in the registry.
    </p>
  );
}

/** A monospace line a reader copies straight into their own file. */
function ImportLine({code}: {code: string}) {
  return (
    <code className="block overflow-x-auto rounded-md border border-fd-border bg-fd-muted px-3 py-2 text-[0.8125rem] whitespace-pre">
      {code}
    </code>
  );
}

export function ComponentHeader({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  return (
    <div className="not-prose mb-8 grid gap-4">
      <HStack gap={2} align="center" wrap="wrap">
        {doc.category ? <Chip label={doc.category} size="sm" /> : null}
        {(doc.keywords ?? []).slice(0, 6).map(keyword => (
          <Text key={keyword} variant="small" color="secondary">
            {keyword}
          </Text>
        ))}
      </HStack>
      <div className="grid gap-2">
        <ImportLine code={`import {${doc.name}} from '@tecton/react';`} />
        <ImportLine
          code={`import {${doc.name}} from '@tecton/react/${doc.name}';`}
        />
      </div>
    </div>
  );
}

export function Guidance({
  kind,
  children,
}: {
  kind: 'do' | 'dont';
  children: ReactNode;
}) {
  const isDo = kind === 'do';
  return (
    <div
      className="my-4 rounded-lg border p-4"
      style={{
        borderColor: isDo ? 'var(--color-success)' : 'var(--color-error)',
        background: isDo
          ? 'var(--color-success-muted)'
          : 'var(--color-error-muted)',
      }}
    >
      <p className="not-prose mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon name={isDo ? 'check-circle' : 'cancel-circle'} size={20} />
        {isDo ? 'Do' : "Don't"}
      </p>
      <div className="prose-no-margin text-sm">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tables, drawn with Tecton's own Table                                      */
/* -------------------------------------------------------------------------- */

function Wrap({children}: {children: ReactNode}) {
  return <div className="not-prose my-4 overflow-x-auto">{children}</div>;
}

const mono = (value: ReactNode) => (
  <code className="text-[0.8125rem] whitespace-nowrap">{value}</code>
);

export function PropsTable({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  const rows = (doc.props ?? []) as readonly DocProp[];
  if (rows.length === 0) return null;
  return (
    <Wrap>
      <Table
        data={rows.map(row => ({...row}))}
        idKey="name"
        density="sm"
        isStriped
        columns={[
          {
            key: 'name',
            header: 'Prop',
            width: {share: 2, minWidth: 140},
            renderCell: row => (
              <span className="flex items-center gap-1.5">
                {mono(row.name)}
                {row.required ? (
                  <span
                    title="Required"
                    style={{color: 'var(--color-error)'}}
                    aria-label="required"
                  >
                    *
                  </span>
                ) : null}
              </span>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            width: {share: 3, minWidth: 160},
            renderCell: row => mono(row.type),
          },
          {
            key: 'default',
            header: 'Default',
            width: {share: 2, minWidth: 110},
            renderCell: row =>
              row.default ? (
                mono(row.default)
              ) : (
                <Text variant="small" color="secondary">
                  —
                </Text>
              ),
          },
          {
            key: 'description',
            header: 'Description',
            width: {share: 5, minWidth: 220},
          },
        ]}
      />
    </Wrap>
  );
}

export function AnatomyTable({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  const rows = (doc.usage.anatomy ?? []) as readonly DocAnatomyPart[];
  if (rows.length === 0) return null;
  return (
    <Wrap>
      <Table
        data={rows.map(row => ({...row}))}
        idKey="name"
        density="sm"
        columns={[
          {
            key: 'name',
            header: 'Part',
            width: {share: 2, minWidth: 120},
            renderCell: row => <strong>{row.name}</strong>,
          },
          {
            key: 'required',
            header: 'Required',
            width: {share: 1, minWidth: 90},
            renderCell: row => (row.required ? 'Yes' : 'No'),
          },
          {key: 'description', header: 'What it is', width: {share: 6}},
        ]}
      />
    </Wrap>
  );
}

export function AccessibilityTable({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  const value = doc.usage.accessibility;
  if (!value) return null;
  if (typeof value === 'string') return <p>{value}</p>;
  const rows = value as readonly DocAccessibilityRow[];
  return (
    <Wrap>
      <Table
        data={rows.map(row => ({...row}))}
        idKey="topic"
        density="sm"
        columns={[
          {
            key: 'topic',
            header: 'Concern',
            width: {share: 2, minWidth: 130},
            renderCell: row => <strong>{row.topic}</strong>,
          },
          {key: 'description', header: 'What Tecton does', width: {share: 6}},
        ]}
      />
    </Wrap>
  );
}

export function ThemingTable({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  const rows = (doc.theming ?? []) as readonly DocThemingTarget[];
  if (rows.length === 0) return null;
  return (
    <Wrap>
      <Table
        data={rows.map(row => ({...row}))}
        idKey="token"
        density="sm"
        columns={[
          {
            key: 'token',
            header: 'Custom property',
            width: {share: 3, minWidth: 200},
            renderCell: row => mono(row.token),
          },
          {key: 'description', header: 'What it changes', width: {share: 5}},
        ]}
      />
    </Wrap>
  );
}

export function RelatedComponents({name}: {name: string}) {
  const doc = find(name);
  if (!doc) return <Unknown name={name} />;
  const related = (doc.related ?? []).filter(other =>
    componentRegistry.some(entry => entry.name === other),
  );
  if (related.length === 0) return null;
  return (
    <div className="not-prose my-4 flex flex-wrap gap-2">
      {related.map(other => (
        <Link
          key={other}
          href={`/docs/components/${other}`}
          className="rounded-md border border-fd-border px-3 py-1.5 text-sm text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          {other}
        </Link>
      ))}
    </div>
  );
}

/** The caption a code block or table in a written guide carries above it. */
export function CodeCaption({children}: {children: ReactNode}) {
  return (
    <p className="not-prose mt-4 mb-1 text-xs font-medium text-fd-muted-foreground">
      {children}
    </p>
  );
}
