/**
 * Tecton toasts.
 *
 * `useToast` returns a function that raises one toast and hands back a way to
 * take it down again. What it takes is **data** — a title, a body, a kind, a
 * duration and at most one action — never a rendered node, so raising a toast
 * never reaches for a component and a later phase can route the same payload
 * anywhere it likes without breaking a caller.
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
import * as stylex from '@stylexjs/stylex';
import {useToast as useBaseToast} from '@astryxdesign/core/Toast';
import {Button} from '@astryxdesign/core/Button';
import {
  colorVars,
  spacingVars,
  typeScaleVars,
} from '@astryxdesign/core/theme/tokens.stylex';

const styles = stylex.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-0-5'],
  },
  title: {
    fontWeight: typeScaleVars['--text-label-weight'],
    color: colorVars['--color-text-primary'],
  },
});

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
  const showToast = useBaseToast();

  return useCallback<ShowToast>(
    ({title, body, type = 'info', durationMs, action}) =>
      showToast({
        body:
          title === undefined ? (
            body
          ) : (
            <span {...stylex.props(styles.body)}>
              <span {...stylex.props(styles.title)}>{title}</span>
              <span>{body}</span>
            </span>
          ),
        type,
        autoHideDuration: durationMs,
        endContent:
          action === undefined ? undefined : (
            <Button
              label={action.label}
              variant="text-only"
              size="sm"
              onClick={action.onAction}
            />
          ),
      }),
    [showToast],
  );
}
