'use client';
import {
  Suspense,
  lazy,
  useEffect,
  useRef,
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
 */
const cache = new Map<string, ComponentType>();

type Loaders = Readonly<Record<string, () => Promise<unknown>>>;

function resolve(id: string, loaders: Loaders): ComponentType | undefined {
  const cached = cache.get(id);
  if (cached) return cached;
  const load = loaders[id];
  if (!load) return undefined;
  const Component = lazy(async () => {
    const module = (await load()) as Record<string, unknown>;
    const exported =
      module[id] ??
      Object.values(module).find(value => typeof value === 'function');
    if (typeof exported !== 'function') {
      throw new Error(`The module for "${id}" exports no component.`);
    }
    return {default: exported as ComponentType};
  });
  cache.set(id, Component);
  return Component;
}

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
  const Component = resolve(id, exampleLoaders);
  if (!Component) return <Missing id={id} />;
  return (
    <Suspense fallback={<Pending />}>
      <Component />
    </Suspense>
  );
}

export function LiveTemplate({id}: {id: string}) {
  const Component = resolve(id, templateLoaders);
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
 * The components index puts one running example in every tile. Loading a
 * hundred and sixty modules the moment the page opens would cost far more than
 * it is worth, so each tile waits until it is near the viewport.
 */
export function WhenVisible({
  children,
  placeholder,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shown) return;
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
  }, [shown]);

  return (
    <div ref={ref} className="contents-none">
      {shown ? children : (placeholder ?? <Pending />)}
    </div>
  );
}
