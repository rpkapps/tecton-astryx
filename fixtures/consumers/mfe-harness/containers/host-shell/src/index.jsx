/**
 * The host shell's own copy of Tecton.
 *
 * In the recommended page shape the shell owns the page: it loads exactly one
 * `tokens.css` — the newest Tecton it knows about, version B here — and calls
 * `configureTectonRoot()` before any container loads. This bundle is what
 * gives the plain-HTML host page access to that call, and it is built against
 * version B for exactly that reason.
 */
import {configureTectonRoot} from '@tecton/react';

let release = null;

export const version = '0.2.0';

export function configureRoot(options) {
  release?.();
  release = configureTectonRoot(options);
  return release;
}

export function releaseRoot() {
  release?.();
  release = null;
}

export default {version, configureRoot, releaseRoot};
