/**
 * The contract each bundle exposes to the host shell:
 *
 *   mount(el, {mode, scope})  render this container into el
 *   unmount()                 tear its React root down
 *   configureRoot({mode})     claim the document root from this copy, the way
 *                             a host shell would from the Tecton version it
 *                             ships
 *
 * `configureRoot` is here so the host page — plain HTML, no bundler — can call
 * the real exported `configureTectonRoot` of a real built version.
 */
import {createRef} from 'react';
import {createRoot} from 'react-dom/client';
import {configureTectonRoot} from '@tecton/react';
import {Container} from './Container.jsx';

export function createContainerApi({id, version}) {
  let root = null;
  let releaseRoot = null;
  const handleRef = createRef();

  function mount(el, opts = {}) {
    const {mode = 'dark', scope = 'root'} = opts;
    root = createRoot(el);
    // No StrictMode: double-invoked effects would double every ref count the
    // assertions measure, which is a separate (real, but distinct) concern.
    root.render(
      <Container
        id={id}
        version={version}
        mode={mode}
        scope={scope}
        handleRef={handleRef}
      />,
    );
    return api;
  }

  function unmount() {
    root?.unmount();
    root = null;
  }

  const api = {
    id,
    version,
    mount,
    unmount,
    configureRoot(options) {
      releaseRoot?.();
      releaseRoot = configureTectonRoot(options);
      return releaseRoot;
    },
    releaseRoot() {
      releaseRoot?.();
      releaseRoot = null;
    },
  };
  return api;
}
