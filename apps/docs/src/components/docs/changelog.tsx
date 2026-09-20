'use client';
import {Chip, Heading, Text} from '@tecton/react';
import {changelog} from '@/generated/changelog';

/** The package's releases, parsed out of its own `CHANGELOG.md`. */
export function Changelog() {
  if (changelog.length === 0) {
    return (
      <div className="not-prose rounded-lg border border-dashed border-fd-border p-8 text-center">
        <Text color="secondary">
          No releases are recorded yet. This page prints{' '}
          <code>packages/react/CHANGELOG.md</code> as soon as the package
          publishes one.
        </Text>
      </div>
    );
  }

  return (
    <div className="not-prose grid gap-10">
      {changelog.map(release => (
        <section key={release.version} className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={2}>{release.version}</Heading>
            {release.date ? <Chip label={release.date} size="sm" /> : null}
          </div>
          {release.sections.map(section => (
            <div key={section.title} className="grid gap-2">
              <Text variant="mediumStrong" display="block">
                {section.title}
              </Text>
              <ul className="grid list-disc gap-1 ps-5 text-sm text-fd-muted-foreground">
                {section.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
