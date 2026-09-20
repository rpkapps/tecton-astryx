'use client';
import {useState, type ReactNode} from 'react';
import {useTheme} from 'next-themes';
import {TectonProvider, ToggleButtonGroup} from '@tecton/react';
import {LivePreview} from './live-preview';

export type PreviewMode = 'dark' | 'light';

const MODES = [
  {value: 'dark', label: 'Dark'},
  {value: 'light', label: 'Light'},
] as const;

const VIEWS = [
  {value: 'preview', label: 'Preview'},
  {value: 'code', label: 'Code'},
] as const;

/**
 * The stage an example renders on.
 *
 * `scope="nested"` matters: the frame puts a second Tecton provider inside the
 * page's own so an example can be looked at in the other colour mode, and a
 * nested provider deliberately does not touch the document root or raise a
 * second toast viewport.
 */
export function PreviewStage({
  mode,
  children,
  className = '',
}: {
  mode: PreviewMode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <TectonProvider mode={mode} scope="nested">
      <div className={`tecton-preview tecton-stage ${className}`}>
        {children}
      </div>
    </TectonProvider>
  );
}

export function ExampleFrame({
  id,
  name,
  description,
  children,
}: {
  id: string;
  name: string;
  description?: string;
  children: ReactNode;
}) {
  const {resolvedTheme} = useTheme();
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [mode, setMode] = useState<PreviewMode | undefined>();
  const active = mode ?? (resolvedTheme === 'light' ? 'light' : 'dark');

  return (
    <figure
      id={id}
      className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border bg-fd-card px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fd-foreground">{name}</p>
          {description ? (
            <p className="text-xs text-fd-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ToggleButtonGroup
            label={`Colour mode for ${name}`}
            size="small"
            items={[...MODES]}
            value={active}
            onChange={value => setMode(value as PreviewMode)}
          />
          <ToggleButtonGroup
            label={`What to show for ${name}`}
            size="small"
            items={[...VIEWS]}
            value={view}
            onChange={value => setView(value as 'preview' | 'code')}
          />
        </div>
      </figcaption>

      <div style={{display: view === 'preview' ? undefined : 'none'}}>
        <PreviewStage
          mode={active}
          className="flex min-h-32 flex-wrap items-center justify-center gap-4 p-8"
        >
          <LivePreview id={id} />
        </PreviewStage>
      </div>
      <div
        className="tecton-code"
        style={{display: view === 'code' ? undefined : 'none'}}
      >
        {children}
      </div>
    </figure>
  );
}
