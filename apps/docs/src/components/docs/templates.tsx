'use client';

/**
 * The page templates.
 *
 * Ported from the upstream docsite's `src/app/(site)/templates/page.tsx` and
 * `templateGalleryOrder.ts`: the templates are grouped by the part of their
 * category before the ` - `, the groups are shown in upstream's own order, and
 * within a group they are sorted by title.
 *
 * Upstream's tile opens a dialog. Ours links to the template's own page, which
 * is where the source is — the site is a static export, and a page a reader can
 * link to beats a dialog they cannot.
 */

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {ToggleButton, ToggleButtonGroup} from '@tecton/react/ToggleButton';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {templateRegistry} from '@/generated/templateRegistry';
import {LiveTemplate, WhenVisible} from './live-preview';
import {PreviewStage, useSiteMode} from './preview-frame';

/** Display order for the top-level groups; anything else sorts after them. */
const GROUP_ORDER = [
  'Dashboard',
  'Table',
  'Form',
  'Settings',
  'Login',
  'Tools',
  'Content',
  'AI Chat',
  'Gallery',
  'Shell',
];

const OTHER_GROUP = 'Other';

/** `Dashboard - Analytics` → `Dashboard`; an untagged template is Other. */
function groupOf(category: string): string {
  if (!category) return OTHER_GROUP;
  const index = category.indexOf(' - ');
  return index === -1 ? category : category.slice(0, index);
}

function groupRank(group: string): number {
  const index = GROUP_ORDER.indexOf(group);
  if (index !== -1) return index;
  return group === OTHER_GROUP ? Number.MAX_SAFE_INTEGER : GROUP_ORDER.length;
}

/**
 * A template at a fraction of its size: rendered at the width it was designed
 * for and scaled down, rather than squeezed into a narrow column where its
 * layout would reflow into something it never looks like.
 */
function TemplateThumbnail({slug, height}: {slug: string; height: number}) {
  const mode = useSiteMode();
  const scale = height / 900;
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-fd-border"
      style={{height, background: 'var(--color-background-muted)'}}
    >
      <div
        className="pointer-events-none absolute top-0 left-0 origin-top-left"
        style={{width: 1440, height: 900, transform: `scale(${scale})`}}
      >
        <PreviewStage mode={mode} className="h-full w-full overflow-hidden">
          <WhenVisible>
            <LiveTemplate id={slug} />
          </WhenVisible>
        </PreviewStage>
      </div>
    </div>
  );
}

export function TemplateGallery() {
  const [active, setActive] = useState('All');

  const items = useMemo(
    () =>
      templateRegistry
        .filter(template => !template.isHiddenFromOverview)
        .map(template => ({...template, group: groupOf(template.category)}))
        .sort(
          (a, b) =>
            groupRank(a.group) - groupRank(b.group) ||
            a.group.localeCompare(b.group) ||
            a.name.localeCompare(b.name),
        ),
    [],
  );

  const groups = useMemo(
    () => [
      'All',
      ...[...new Set(items.map(item => item.group))].sort(
        (a, b) => groupRank(a) - groupRank(b) || a.localeCompare(b),
      ),
    ],
    [items],
  );

  const shown = useMemo(
    () =>
      (active === 'All' ? items : items.filter(item => item.group === active))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [items, active],
  );

  return (
    <div className="not-prose grid gap-6">
      <ToggleButtonGroup
        label="Filter templates by category"
        value={active}
        onChange={value => setActive(value ?? 'All')}
      >
        {groups.map(group => (
          <ToggleButton key={group} label={group} value={group} />
        ))}
      </ToggleButtonGroup>

      <div className="grid gap-6 lg:grid-cols-2">
        {shown.map(template => (
          <Link
            key={template.slug}
            href={`/docs/templates/${template.slug}`}
            className="grid gap-2 rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
          >
            <TemplateThumbnail slug={template.slug} height={240} />
            <VStack gap={0}>
              <Text weight="bold">{template.displayName}</Text>
              <Text type="supporting" color="secondary" maxLines={2}>
                {template.description}
              </Text>
            </VStack>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** One template on its own page: the whole screen, live, at half size. */
export function TemplatePreview({slug}: {slug: string}) {
  const mode = useSiteMode();
  const template = templateRegistry.find(entry => entry.slug === slug);
  if (!template) {
    return (
      <p className="text-sm" style={{color: 'var(--color-error)'}}>
        No template is registered for <code>{slug}</code>.
      </p>
    );
  }
  return (
    <figure
      id={slug}
      className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-fd-border bg-fd-card px-4 py-3">
        <p className="text-sm font-semibold text-fd-foreground">
          {template.displayName}
        </p>
        <p className="text-xs text-fd-muted-foreground">
          Rendered at 1440 × 900, scaled to fit
        </p>
      </figcaption>
      <div className="relative h-[540px] overflow-hidden">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{width: 1440, height: 900, transform: 'scale(0.6)'}}
        >
          <PreviewStage mode={mode} className="h-full w-full overflow-auto">
            <LiveTemplate id={slug} />
          </PreviewStage>
        </div>
      </div>
    </figure>
  );
}
