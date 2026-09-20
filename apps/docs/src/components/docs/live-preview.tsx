import {
  Suspense,
  lazy,
  useCallback,
  useState,
  useSyncExternalStore,
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
 * example's own module and mounts it after hydration. The module is the file
 * under `apps/docs/examples`, which is also the source the Code tab shows —
 * they cannot drift, because they are the same file.
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

/**
 * Whether this is the browser, after the first render.
 *
 * An example is a running program: it reads the browser it is in, measures
 * elements, asks whether speech recognition exists. Rendering it into the
 * prerendered HTML would mean rendering it somewhere none of that is true, and
 * a reader's browser would then disagree with the file it was served — which
 * React reports as a hydration error and repairs by drawing the page twice.
 * The frame, the description and the source are prerendered; what runs, runs
 * where it was written to run.
 */
const neverChanges = () => () => {};

function useMounted(): boolean {
  // The server snapshot is what is rendered into the HTML and what the first
  // client render has to agree with; the client snapshot is what every render
  // after hydration sees.
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

function Live({
  id,
  components,
}: {
  id: string;
  components: Record<string, ComponentType>;
}) {
  const mounted = useMounted();
  const Component = components[id];
  if (!Component) return <Missing id={id} />;
  if (!mounted) return <Pending />;
  return (
    <Suspense fallback={<Pending />}>
      <Component />
    </Suspense>
  );
}

export function LivePreview({id}: {id: string}) {
  return <Live id={id} components={EXAMPLES} />;
}

export function LiveTemplate({id}: {id: string}) {
  return <Live id={id} components={TEMPLATES} />;
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
