'use client';

/**
 * What a generated component page reaches for.
 *
 * Each of these takes a component name, finds that page's entry in the
 * generated registry and hands it to the ported section component. The MDX
 * carries the prose — the description, the dos and don'ts, the headings — so
 * that search indexes it; the data that belongs in a table stays data.
 */

import {useMemo} from 'react';
import Link from 'next/link';
import {HStack, VStack} from '@tecton/react/Layout';
import {Divider} from '@tecton/react/Divider';
import {Badge} from '@tecton/react/Badge';
import {Card} from '@tecton/react/Card';
import {componentRegistry} from '@/generated/componentRegistry';
import type {ComponentEntry} from '@/types/docs';
import {Accessibility} from '../component-detail/Accessibility';
import {Anatomy} from '../component-detail/Anatomy';
import {HookSignature} from '../component-detail/HookSignature';
import {
  InteractivePreviewStage,
  useInteractiveState,
} from '../component-detail/InteractivePreview';
import {PlaygroundPropsTable} from '../component-detail/PlaygroundPropsTable';
import {PropsTable as PropsTableView} from '../component-detail/PropsTable';
import {Theming as ThemingView} from '../component-detail/Theming';

const byName = new Map<string, ComponentEntry>(
  componentRegistry.map(entry => [entry.name, entry]),
);

function useEntry(name: string): ComponentEntry | undefined {
  return byName.get(name);
}

function Unknown({name}: {name: string}) {
  return (
    <p className="text-sm" style={{color: 'var(--color-error)'}}>
      No page documents <code>{name}</code>.
    </p>
  );
}

export function AnatomyTable({name}: {name: string}) {
  const entry = useEntry(name);
  if (!entry) return <Unknown name={name} />;
  return <Anatomy elements={entry.usage?.anatomy ?? []} />;
}

export function PropsTable({name}: {name: string}) {
  const entry = useEntry(name);
  if (!entry) return <Unknown name={name} />;
  return <PropsTableView props={entry.props} />;
}

/** One part of a module — a subcomponent or a hook it ships with. */
export function PartTable({
  component,
  name,
}: {
  component: string;
  name: string;
}) {
  const entry = useEntry(component);
  if (!entry) return <Unknown name={component} />;
  const part = entry.subcomponents.find(sub => sub.name === name);
  if (!part) {
    return (
      <p className="text-sm" style={{color: 'var(--color-error)'}}>
        <code>{component}</code> has no part called <code>{name}</code>.
      </p>
    );
  }
  if (part.isHook && (part.params?.length || part.returns?.length)) {
    return (
      <HookSignature params={part.params ?? []} returns={part.returns ?? []} />
    );
  }
  return <PropsTableView props={part.props} />;
}

export function HookSignatureSection({name}: {name: string}) {
  const entry = useEntry(name);
  if (!entry) return <Unknown name={name} />;
  return (
    <HookSignature params={entry.params ?? []} returns={entry.returns ?? []} />
  );
}

export function Theming({name}: {name: string}) {
  const entry = useEntry(name);
  if (!entry) return <Unknown name={name} />;
  if (!entry.theming) return null;
  return <ThemingView theming={entry.theming} props={entry.props} />;
}

export function AccessibilitySection({name}: {name: string}) {
  const entry = useEntry(name);
  if (!entry) return <Unknown name={name} />;
  return <Accessibility requirements={entry.usage?.accessibility ?? []} />;
}

/** The preview and the knobs that drive it. */
export function Playground({name}: {name: string}) {
  const entry = useEntry(name);
  const props = useMemo(() => entry?.props ?? [], [entry]);
  const {knobs, state, setProp, missingRequiredProps} = useInteractiveState(
    props,
    entry?.playground ?? null,
  );

  if (!entry) return <Unknown name={name} />;

  const canControlOpenState =
    entry.props.some(prop => prop.name === 'isOpen') &&
    entry.props.some(prop => prop.name === 'onOpenChange');

  return (
    <VStack gap={4}>
      <InteractivePreviewStage
        name={entry.name}
        state={state}
        knobs={knobs}
        playground={entry.playground}
        missingRequiredProps={missingRequiredProps}
        onPropChange={setProp}
        canControlOpenState={canControlOpenState}
      />
      <PlaygroundPropsTable
        props={entry.props}
        knobs={knobs}
        state={state}
        onPropChange={setProp}
      />
    </VStack>
  );
}

/** Where a reader is likely to go next. */
export function Related({names}: {names: readonly string[]}) {
  const known = names.filter(name => byName.has(name));
  if (known.length === 0) return null;
  return (
    <div className="not-prose my-4 flex flex-wrap gap-2">
      {known.map(name => (
        <Link
          key={name}
          href={`/docs/components/${name}`}
          className="rounded-md border border-fd-border px-3 py-1.5 text-sm text-fd-foreground no-underline transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
        >
          {byName.get(name)?.displayName ?? name}
        </Link>
      ))}
    </div>
  );
}

/** The caption a code block or table in a written guide carries above it. */
export function CodeCaption({children}: {children: React.ReactNode}) {
  return (
    <p className="not-prose mt-4 mb-1 text-xs font-medium text-fd-muted-foreground">
      {children}
    </p>
  );
}

/**
 * The best-practices block: one row per practice, each carrying the Do or
 * Don't badge that says which kind it is.
 *
 * Ported from the upstream docsite's `src/components/docs/BestPracticesBlock.tsx`,
 * which draws the same shape with a `Table`. Here the rows are the MDX's own
 * Markdown, so the prose is on the page rather than in a data attribute and the
 * search index can read it; the frame, the dividers and the badges are the
 * component's.
 */
export function BestPractices({children}: {children: React.ReactNode}) {
  return (
    <div className="not-prose my-4">
      <Card variant="default">
        <VStack gap={0}>{children}</VStack>
      </Card>
    </div>
  );
}

/** One practice: its badge, and what it says. */
export function Practice({
  kind,
  children,
}: {
  kind: 'do' | 'dont';
  children: React.ReactNode;
}) {
  const isDo = kind === 'do';
  return (
    <>
      <Divider />
      <HStack gap={3} vAlign="start" style={{paddingBlock: 'var(--spacing-3)'}}>
        <span style={{flexBasis: 84, flexShrink: 0}}>
          <Badge
            label={isDo ? 'Do' : "Don't"}
            variant={isDo ? 'success' : 'error'}
          />
        </span>
        <div className="tecton-guidance min-w-0 flex-1 text-sm">{children}</div>
      </HStack>
    </>
  );
}
