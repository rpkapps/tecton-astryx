'use client';
import {
  Suspense,
  lazy,
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {exampleLoaders} from '@/generated/exampleLoaders';
import {templateLoaders} from '@/generated/templateLoaders';

/**
 * Examples, running.
 *
 * The site is a static export, so nothing here renders during the build: the
 * page ships a dynamic import per example, and the browser fetches the
 * example's own module and mounts it after hydration. The module is the same
 * source the Code tab shows, generated from the file that lives beside the
 * component in `packages/react`, which is what stops the two drifting apart.
 *
 * The lazy wrappers are built once, when this module is first evaluated.
 * `lazy()` does not call its loader, so this costs one small object per example
 * and nothing is fetched until something actually renders.
 */
type Loaders = Readonly<Record<string, () => Promise<unknown>>>;

function lazyComponents(loaders: Loaders): Record<string, ComponentType> {
  const map: Record<string, ComponentType> = {};
  for (const [id, load] of Object.entries(loaders)) {
    map[id] = lazy(async () => {
      const module = (await load()) as Record<string, unknown>;
      const exported =
        module[id] ??
        Object.values(module).find(value => typeof value === 'function');
      if (typeof exported !== 'function') {
        throw new Error(`The module for "${id}" exports no component.`);
      }
      return {default: exported as ComponentType};
    });
  }
  return map;
}

const EXAMPLES = lazyComponents(exampleLoaders);
const TEMPLATES = lazyComponents(templateLoaders);

function Missing({id}: {id: string}) {
  return (
    <p className="text-sm" style={{color: 'var(--color-error)'}}>
      No module is registered for <code>{id}</code>.
    </p>
  );
}

function Pending() {
  return (
    <div
      aria-hidden
      className="h-6 w-32 animate-pulse rounded"
      style={{background: 'var(--color-skeleton)'}}
    />
  );
}

export function LivePreview({id}: {id: string}) {
  const Component = EXAMPLES[id];
  if (!Component) return <Missing id={id} />;
  return (
    <Suspense fallback={<Pending />}>
      <Component />
    </Suspense>
  );
}

export function LiveTemplate({id}: {id: string}) {
  const Component = TEMPLATES[id];
  if (!Component) return <Missing id={id} />;
  return (
    <Suspense fallback={<Pending />}>
      <Component />
    </Suspense>
  );
}

/**
 * Mount the children only once they are close to being looked at.
 *
 * The components index puts one running example in every tile. Loading every
 * module the moment the page opens would cost far more than it is worth, so a
 * tile waits until it is near the viewport. The observer is attached from the
 * ref callback rather than an effect, so it is set up in the same commit that
 * puts the element in the document and torn down when it leaves.
 */
export function WhenVisible({
  children,
  placeholder,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
}) {
  const [shown, setShown] = useState(false);

  const watch = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    // Without an observer — an old browser, or a test harness — show it now.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) setShown(true);
      },
      {rootMargin: '400px'},
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The wrapper keeps a layout box on purpose: an element with `display:
  // contents` has none, and an IntersectionObserver would never report it.
  return (
    <div ref={watch}>{shown ? children : (placeholder ?? <Pending />)}</div>
  );
}
