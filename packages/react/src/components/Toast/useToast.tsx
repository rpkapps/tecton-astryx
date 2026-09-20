/**
 * Tecton toasts.
 *
 * `useToast` returns a function that raises one toast and hands back a way to
 * take it down again. What it takes is **data** — a title, a body, a kind, a
 * duration and at most one action — never a rendered node, so raising a toast
 * never reaches for a component.
 *
 * That data-only shape is what lets the toast go anywhere. Every raised toast
 * is routed through a document-keyed bus (`../../runtime/toastBus.ts`) to the
 * one viewport on the page, whichever copy of Tecton mounted it: with two
 * copies on a page, two viewports used to land at identical coordinates and
 * draw their toasts on top of each other (measured, F8/F12 in
 * `docs/engineering/micro-frontends/analysis.md`). An element built by one
 * copy's React cannot be rendered by another's, so only data crosses; the copy
 * that owns the viewport renders it with its own components.
 *
 * @example
 * const toast = useToast();
 * toast({body: 'Model saved'});
 * toast({
 *   title: 'Could not save',
 *   body: 'The connection dropped. Nothing was lost.',
 *   type: 'error',
 *   action: {label: 'Retry', onAction: save},
 * });
 */
import {useCallback} from 'react';
import {routeToast} from '../../runtime/toastBus.js';

/** What kind of toast this is. An error toast stays until it is dismissed. */
export type ToastType = 'info' | 'error';

/** The one action a toast may offer. */
export interface ToastAction {
  /** What the action is called. Two or three words at most. */
  label: string;
  /** Called when the action is taken. */
  onAction: () => void;
}

/**
 * Everything a toast is. Plain data: no elements, no handlers beyond the one
 * action, nothing that has to be rendered by the caller.
 */
export interface ToastPayload {
  /** A headline, for a toast whose body needs one. */
  title?: string;
  /** The message. */
  body: string;
  /**
   * What kind of toast this is.
   * @default 'info'
   */
  type?: ToastType;
  /**
   * How long the toast stays, in milliseconds. An error toast ignores it and
   * stays until it is dismissed.
   * @default 5000
   */
  durationMs?: number;
  /** The one action the toast offers. */
  action?: ToastAction;
}

/** Takes a toast down again. */
export type DismissToast = () => void;

/** Raises a toast and returns the function that takes it down. */
export type ShowToast = (payload: ToastPayload) => DismissToast;

export function useToast(): ShowToast {
  // Nothing here depends on where the toast will be shown, which is the point:
  // the hook works the same in a page-root provider, in a nested container and
  // in a container whose own provider renders no viewport at all.
  return useCallback<ShowToast>(payload => routeToast(payload), []);
}
