'use client';

/**
 * One example: the name, the thing running, and its source.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/ExampleBlock.tsx` — the preview above,
 * Description and Code tabs below — minus the playground and shadcn tabs, which
 * this site has no equivalent of.
 *
 * The example is not re-implemented and not rewritten: `LivePreview` mounts the
 * very file under `apps/docs/examples` whose text the Code tab shows, so the
 * two cannot drift. That file imports `@tecton/react` subpaths directly, which
 * is why the code is printed verbatim.
 */

import {useState, type ReactNode} from 'react';
import {Tab, TabList} from '@tecton/react/TabList';
import {PreviewFrame} from '../docs/preview-frame';
import {LivePreview} from '../docs/live-preview';
import {MarkdownText} from './MarkdownText';

export function ExampleBlock({
  id,
  name,
  description,
  children,
}: {
  id: string;
  name: string;
  description?: string;
  /** The fenced code block the generator wrote into the MDX. */
  children: ReactNode;
}) {
  const [tab, setTab] = useState('description');

  return (
    <PreviewFrame
      id={id}
      name={name}
      footer={
        <div className="border-t border-fd-border bg-fd-card">
          <div className="px-3 pt-2">
            <TabList value={tab} onChange={setTab} size="sm">
              <Tab value="description" label="Description" />
              <Tab value="code" label="Code" />
            </TabList>
          </div>
          <div
            className="tecton-example-description px-4 py-3"
            style={{display: tab === 'description' ? undefined : 'none'}}
          >
            <MarkdownText type="body" color="secondary">
              {description || 'No description available.'}
            </MarkdownText>
          </div>
          <div
            className="tecton-code"
            style={{display: tab === 'code' ? undefined : 'none'}}
          >
            {children}
          </div>
        </div>
      }
    >
      <LivePreview id={id} />
    </PreviewFrame>
  );
}
