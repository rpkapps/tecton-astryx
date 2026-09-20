'use client';

/**
 * A component's showcase, cropped and scaled down to a gallery tile.
 *
 * Ported from the upstream docsite's `src/components/ShowcaseThumbnail.tsx`.
 * The showcase renders at twice the tile's width and is scaled back by half, so
 * a 260px tile shows a 520px-wide composition — expressed as `200%` plus
 * `scale(0.5)`, which is pure CSS: no measured width, no ResizeObserver, so a
 * tile renders on the server as happily as in the browser.
 *
 * The first few tiles are statically imported (`eagerShowcases`, written by the
 * generator) so they are in the prerendered HTML. Everything below the fold
 * waits until it is near the viewport.
 */

import {Component, type ReactNode} from 'react';
import {Skeleton} from '@tecton/react/Skeleton';
import {Text} from '@tecton/react/Text';
import {showcaseFor} from '@/generated/showcaseRegistry';
import {eagerShowcases} from '@/generated/eagerShowcases';
import {LivePreview, WhenVisible} from './live-preview';
import {PreviewStage, useSiteMode} from './preview-frame';

class ShowcaseErrorBoundary extends Component<
  {children: ReactNode},
  {hasError: boolean}
> {
  state = {hasError: false};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text type="supporting" color="secondary">
          Preview unavailable
        </Text>
      );
    }
    return this.props.children;
  }
}

/** The tile itself: it crops and scales whatever preview is put inside it. */
function ThumbnailFrame({children}: {children: ReactNode}) {
  const mode = useSiteMode();
  return (
    <div
      className="tecton-thumbnail relative aspect-[16/10] w-full overflow-hidden rounded-lg"
      style={{background: 'var(--color-background-muted)'}}
      inert
    >
      <div className="tecton-thumbnail-scaler">
        <ShowcaseErrorBoundary>
          <PreviewStage
            mode={mode}
            className="flex h-full w-full items-center justify-center"
          >
            {children}
          </PreviewStage>
        </ShowcaseErrorBoundary>
      </div>
    </div>
  );
}

/** The tile for a component, or a muted placeholder when it has no showcase. */
export function ShowcaseThumbnail({name}: {name: string}) {
  const id = showcaseFor[name];
  const Eager = eagerShowcases[name];

  if (!id) {
    return (
      <div
        className="aspect-[16/10] w-full rounded-lg"
        style={{background: 'var(--color-background-muted)'}}
      />
    );
  }

  // Above the fold: statically imported, so it is in the prerendered HTML.
  if (Eager) {
    return (
      <ThumbnailFrame>
        <Eager />
      </ThumbnailFrame>
    );
  }

  // Below the fold: the showcase's own chunk is fetched as the tile approaches.
  return (
    <ThumbnailFrame>
      <WhenVisible placeholder={<Skeleton width="100%" height="100%" />}>
        <LivePreview id={id} />
      </WhenVisible>
    </ThumbnailFrame>
  );
}
