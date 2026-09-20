/**
 * The stage everything live on this site renders on.
 *
 * Upstream puts its previews under its neutral theme; Tecton's site puts them
 * under Tecton's, because the point of the page is what Tecton's theme makes of
 * the component. `scope="nested"` is what makes that safe: a nested provider
 * paints its subtree and nothing else — it does not claim the document root and
 * it does not raise a second toast viewport — so a preview can be looked at in
 * the mode the page is not in.
 */

import {useState, type ReactNode} from 'react';
import {useTheme} from 'fumadocs-ui/provider/base';
import {TectonProvider} from '@tecton/react';
import {ToggleButton, ToggleButtonGroup} from '@tecton/react/ToggleButton';

export type PreviewMode = 'dark' | 'light';

/** Which mode the page itself is in, as Tecton names it. */
export function useSiteMode(): PreviewMode {
  const {resolvedTheme} = useTheme();
  return resolvedTheme === 'light' ? 'light' : 'dark';
}

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

/** The dark/light switch every preview on the site carries. */
export function ModeToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}) {
  return (
    <ToggleButtonGroup
      label={label}
      size="sm"
      value={value}
      onChange={next => onChange((next as PreviewMode) ?? value)}
    >
      <ToggleButton label="Dark" value="dark" />
      <ToggleButton label="Light" value="light" />
    </ToggleButtonGroup>
  );
}

/**
 * A titled frame around something running: the name, the mode switch, an
 * optional action of the caller's own, and the stage itself.
 */
export function PreviewFrame({
  name,
  description,
  action,
  children,
  footer,
  isBare = false,
  id,
}: {
  name: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Skip the stage's own padding — for a frame whose body draws its own. */
  isBare?: boolean;
  id?: string;
}) {
  const siteMode = useSiteMode();
  const [override, setOverride] = useState<PreviewMode | undefined>();
  const mode = override ?? siteMode;

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
          {action}
          <ModeToggle
            label={`Colour mode for ${name}`}
            value={mode}
            onChange={setOverride}
          />
        </div>
      </figcaption>

      <PreviewStage
        mode={mode}
        className={
          isBare
            ? ''
            : 'flex min-h-32 flex-wrap items-center justify-center gap-4 p-8'
        }
      >
        {children}
      </PreviewStage>
      {footer}
    </figure>
  );
}
