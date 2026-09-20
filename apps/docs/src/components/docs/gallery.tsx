'use client';
import {useMemo, useState} from 'react';
import Link from 'next/link';
import {Card, Text, TextField} from '@tecton/react';
import {componentRegistry} from '@/generated/componentRegistry';
import {exampleRegistry} from '@/generated/exampleRegistry';
import {templateRegistry} from '@/generated/templateRegistry';
import {guideRegistry} from '@/generated/guideRegistry';
import {foundationPages} from '@/generated/foundationPages';
import {LivePreview, LiveTemplate, WhenVisible} from './live-preview';
import {PreviewStage} from './example-frame';
import {useSiteMode} from './use-site-mode';

/** The example a component leads with — its first, which is its simplest. */
function leadExample(name: string) {
  const doc = componentRegistry.find(entry => entry.name === name);
  const first = doc?.examples?.[0];
  return first && exampleRegistry.some(entry => entry.id === first)
    ? first
    : undefined;
}

/**
 * The components index.
 *
 * Every tile is the component running, not a screenshot of it: the tile mounts
 * the component's first example as soon as it is near the viewport. The
 * categories come from the registry, so a component added to the package lands
 * in the right group here without this file changing.
 */
export function ComponentGallery() {
  const mode = useSiteMode();
  const [filter, setFilter] = useState('');

  const groups = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    const matches = componentRegistry.filter(doc => {
      if (!needle) return true;
      return (
        doc.name.toLowerCase().includes(needle) ||
        (doc.category ?? '').toLowerCase().includes(needle) ||
        (doc.keywords ?? []).some(keyword =>
          keyword.toLowerCase().includes(needle),
        )
      );
    });
    const byCategory = new Map<string, typeof matches>();
    for (const doc of matches) {
      const category = doc.category ?? 'Other';
      byCategory.set(category, [...(byCategory.get(category) ?? []), doc]);
    }
    return [...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filter]);

  const shown = groups.reduce((total, [, docs]) => total + docs.length, 0);

  return (
    <div className="not-prose grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full max-w-sm">
          <TextField
            label="Filter components"
            placeholder="Search by name, category or keyword"
            value={filter}
            onChange={setFilter}
            startIcon="search"
          />
        </div>
        <Text variant="small" color="secondary">
          {shown} of {componentRegistry.length} components, {groups.length}{' '}
          {groups.length === 1 ? 'category' : 'categories'}
        </Text>
      </div>

      {groups.length === 0 ? (
        <Text color="secondary">Nothing matches “{filter}”.</Text>
      ) : null}

      {groups.map(([category, docs]) => (
        <section key={category} className="grid gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-fd-muted-foreground uppercase">
            {category}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {docs.map(doc => {
              const example = leadExample(doc.name);
              return (
                <Link
                  key={doc.name}
                  href={`/docs/components/${doc.name}`}
                  className="group grid gap-0 overflow-hidden rounded-lg border border-fd-border no-underline transition-colors hover:border-fd-primary"
                >
                  <PreviewStage
                    mode={mode}
                    className="flex min-h-28 items-center justify-center overflow-hidden p-4"
                  >
                    {example ? (
                      <WhenVisible>
                        <LivePreview id={example} />
                      </WhenVisible>
                    ) : (
                      <Text variant="small" color="secondary">
                        No example yet
                      </Text>
                    )}
                  </PreviewStage>
                  <div className="border-t border-fd-border bg-fd-card px-4 py-3">
                    <p className="text-sm font-semibold text-fd-foreground">
                      {doc.displayName ?? doc.name}
                    </p>
                    <p className="line-clamp-2 text-xs text-fd-muted-foreground">
                      {doc.usage.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * The page templates.
 *
 * The registry is empty until `@tecton/react/templates` publishes something, so
 * this reads as an empty state rather than as a broken page; the day a template
 * lands in the package it appears here.
 */
export function TemplateGallery() {
  const mode = useSiteMode();
  if (templateRegistry.length === 0) {
    return (
      <div className="not-prose rounded-lg border border-dashed border-fd-border p-8 text-center">
        <Text color="secondary">
          No page templates are published yet. This gallery is printed from the
          template registry, so it fills itself in as soon as one is.
        </Text>
      </div>
    );
  }
  return (
    <div className="not-prose grid gap-6 lg:grid-cols-2">
      {templateRegistry.map(template => (
        <Link
          key={template.id}
          href={`/docs/templates/${template.id}`}
          className="grid overflow-hidden rounded-lg border border-fd-border no-underline transition-colors hover:border-fd-primary"
        >
          <TemplateThumbnail id={template.id} mode={mode} />
          <div className="border-t border-fd-border bg-fd-card px-4 py-3">
            <p className="text-sm font-semibold text-fd-foreground">
              {template.displayName ?? template.name}
            </p>
            <p className="text-xs text-fd-muted-foreground">
              {template.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * A template at a tenth of its size.
 *
 * The template is a whole page, so it is rendered at full width inside a frame
 * that is scaled down — the layout it is designed for, shrunk, rather than a
 * narrow page that reflows into something the template never looks like.
 */
function TemplateThumbnail({id, mode}: {id: string; mode: 'dark' | 'light'}) {
  return (
    <div className="relative h-64 overflow-hidden">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{width: 1440, height: 900, transform: 'scale(0.32)'}}
      >
        <PreviewStage mode={mode} className="h-full w-full overflow-hidden">
          <WhenVisible>
            <LiveTemplate id={id} />
          </WhenVisible>
        </PreviewStage>
      </div>
    </div>
  );
}

/** A template on its own page: the same frame, wider, and switchable. */
export function TemplatePreview({id}: {id: string}) {
  const mode = useSiteMode();
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border">
      <div className="relative h-[32rem] overflow-auto">
        <div
          className="origin-top-left"
          style={{width: 1440, transform: 'scale(0.62)'}}
        >
          <PreviewStage mode={mode} className="min-h-[800px] w-full">
            <LiveTemplate id={id} />
          </PreviewStage>
        </div>
      </div>
    </div>
  );
}

/** The "start here" tiles on the docs index. */
export function DocsIndex() {
  const tiles = [
    ...guideRegistry.map(guide => ({
      href: `/docs/${guide.name}`,
      title: guide.title,
      description: guide.description,
      group: 'Guides',
    })),
    ...foundationPages.map(page => ({
      href: `/docs/foundations/${page.name}`,
      title: page.title,
      description: 'Printed from the built theme.',
      group: 'Foundations',
    })),
    {
      href: '/docs/components',
      title: 'Components',
      description: `All ${componentRegistry.length} components, each with live examples.`,
      group: 'Library',
    },
    {
      href: '/docs/templates',
      title: 'Page templates',
      description: 'Whole pages assembled from Tecton components.',
      group: 'Library',
    },
  ];

  const groups = [...new Set(tiles.map(tile => tile.group))];

  return (
    <div className="not-prose grid gap-8">
      {groups.map(group => (
        <section key={group} className="grid gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-fd-muted-foreground uppercase">
            {group}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiles
              .filter(tile => tile.group === group)
              .map(tile => (
                <Link key={tile.href} href={tile.href} className="no-underline">
                  <Card variant="muted" minHeight={96}>
                    <p className="text-sm font-semibold text-fd-foreground">
                      {tile.title}
                    </p>
                    <p className="mt-1 text-xs text-fd-muted-foreground">
                      {tile.description}
                    </p>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
