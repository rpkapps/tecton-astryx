/**
 * The contract each bundle exposes to the host page:
 *
 *   mount(el, {mode, scope})   render this container into el
 *   unmount()                  tear its React root down
 *   configureRoot({mode})      claim the document root from this copy, the way
 *                              a host shell would from the Tecton version it
 *                              ships
 *   openDialog() / closeDialog() / openMenu() / closeMenu() / raiseToast()
 *                              drive this container's own layers and toasts
 *
 * `configureRoot` is here so the host page — plain HTML, no bundler — can call
 * the real exported `configureTectonRoot` of a real published version.
 */
import {createRef} from 'react';
import {createRoot} from 'react-dom/client';
import {configureTectonRoot} from '@tecton/react';
import {Container} from './Container.jsx';

export function createContainerApi({id, version}) {
  let root = null;
  let releaseRoot = null;
  const handleRef = createRef();

  const api = {
    id,
    version,
    mount(el, opts = {}) {
      const {mode = 'dark', scope = 'nested'} = opts;
      root = createRoot(el);
      // No StrictMode: double-invoked effects would double every ref count
      // the assertions measure.
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
    },
    unmount() {
      root?.unmount();
      root = null;
    },
    openDialog: () => handleRef.current?.openDialog(),
    closeDialog: () => handleRef.current?.closeDialog(),
    openMenu: () => handleRef.current?.openMenu(),
    closeMenu: () => handleRef.current?.closeMenu(),
    raiseToast: body => handleRef.current?.raiseToast(body),
    configureRoot(options) {
      releaseRoot?.();
      releaseRoot = configureTectonRoot(options);
      return releaseRoot;
    },
  };
  return api;
}
