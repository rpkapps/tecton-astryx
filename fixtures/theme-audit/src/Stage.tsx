/**
 * The stage both renders share.
 *
 * One example mounts inside `#stage` at a fixed width, so the two renders are
 * measured against the same box and element paths line up between them.
 */
import {
  Component,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {examples, exampleIds, pickComponent} from './examples';

declare global {
  interface Window {
    /** Set once the requested example has mounted (or failed to). */
    __auditReady?: {id: string; ok: boolean; error?: string};
    __auditExampleIds?: readonly string[];
  }
}

/**
 * Keeps `#stage` on the page when an example throws.
 *
 * Without it a single throwing example unmounts the whole root, the probe finds
 * no stage, and the audit reports "measure failed" for something that is really
 * "this example does not render" — which is a finding in its own right and has
 * to be told apart from the harness losing its footing.
 */
class StageBoundary extends Component<
  {children: ReactNode; id: string},
  {message: string | null}
> {
  state = {message: null as string | null};

  static getDerivedStateFromError(error: unknown) {
    return {message: error instanceof Error ? error.message : String(error)};
  }

  componentDidCatch(error: unknown) {
    window.__auditReady = {
      id: this.props.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  render() {
    if (this.state.message != null) {
      return (
        <div id="stage" data-audit-error={this.state.message}>
          {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

function readExampleId(): string | null {
  return new URLSearchParams(window.location.search).get('ex');
}

export function Stage() {
  const id = readExampleId();
  const [state, setState] = useState<{
    Component: ComponentType | null;
    error: string | null;
  }>({Component: null, error: null});

  useEffect(() => {
    window.__auditExampleIds = exampleIds;
  }, []);

  useEffect(() => {
    let live = true;
    if (id == null) return;
    const entry = examples.find(candidate => candidate.id === id);
    if (entry == null) {
      window.__auditReady = {id, ok: false, error: 'unknown example'};
      // Queued rather than set here: a synchronous setState inside an effect
      // makes React re-render before paint, which this harness has no reason
      // to do and the lint rules rightly object to.
      queueMicrotask(() => {
        if (live) setState({Component: null, error: `unknown example: ${id}`});
      });
      return () => {
        live = false;
      };
    }
    entry
      .load()
      .then(module => {
        if (!live) return;
        const Component = pickComponent(module, entry.name) as
          ComponentType | undefined;
        if (typeof Component !== 'function') {
          setState({
            Component: null,
            error: `no export named ${entry.name}`,
          });
          window.__auditReady = {id, ok: false, error: 'missing export'};
          return;
        }
        setState({Component, error: null});
      })
      .catch((error: unknown) => {
        if (!live) return;
        const message = error instanceof Error ? error.message : String(error);
        setState({Component: null, error: message});
        window.__auditReady = {id, ok: false, error: message};
      });
    return () => {
      live = false;
    };
  }, [id]);

  useEffect(() => {
    if (id == null || state.Component == null) return;
    // Two frames: one for layout, one for anything that measures in an effect.
    const handle = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.__auditReady = {id, ok: true};
      }),
    );
    return () => cancelAnimationFrame(handle);
  }, [id, state.Component]);

  if (id == null) {
    return <div id="stage">pass ?ex=&lt;Dir&gt;/&lt;Name&gt;</div>;
  }
  if (state.error != null) {
    return (
      <div id="stage" data-audit-error={state.error}>
        {state.error}
      </div>
    );
  }
  const Example = state.Component;
  return (
    <StageBoundary id={id}>
      <div id="stage">{Example != null ? <Example /> : null}</div>
    </StageBoundary>
  );
}
