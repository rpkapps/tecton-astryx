/**
 * TEMPORARY. The root `@tecton/react` surface, as the contract describes it,
 * for typechecking the ported examples before the package is reworked:
 * everything `@astryxdesign/core` exports, plus Tecton's own provider.
 *
 * `TectonProvider` is declared here rather than imported from
 * `packages/react/src`, so that typechecking the examples never depends on the
 * state of the package while it is being reworked.
 *
 * Goes away with `port-examples.tsconfig.json`.
 */
import type {ReactNode} from 'react';

export * from '../../../packages/react/node_modules/@astryxdesign/core/dist/index';

export declare function TectonProvider(props: {
  children: ReactNode;
  mode?: 'dark' | 'light' | 'system';
  scope?: 'root' | 'nested';
}): ReactNode;
