/**
 * The page's one toast viewport, wired to the document-keyed toast bus.
 *
 * `TectonProvider scope="root"` renders this inside its layer provider, where
 * the viewport lives. It publishes that viewport's add/remove into the bus
 * (`../../runtime/toastBus.ts`), so a toast raised by **any** copy of Tecton on
 * the page — including containers whose own provider is `scope="nested"` and
 * therefore renders no viewport — is shown here, in one stack, with one set of
 * dismiss timers.
 *
 * This is the only place that turns toast *data* into toast *elements*. The bus
 * carries strings and one action descriptor, because an element created by
 * another copy's React cannot be rendered by this one.
 *
 * It renders nothing.
 */
import {useEffect, useRef} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useToast as useBaseToast} from '@astryxdesign/core/Toast';
import {Button} from '@astryxdesign/core/Button';
import {
  colorVars,
  spacingVars,
  typeScaleVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {
  publishToastViewport,
  type TectonToastData,
} from '../../runtime/toastBus.js';

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

export function ToastBridge() {
  const showToast = useBaseToast();

  // The bus calls `add` during an event, outside React's render, so it has to
  // reach the latest closure rather than the one captured when it published.
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  });

  useEffect(() => {
    /** How to take each toast this viewport is showing back down. */
    const dismissers = new Map<string, () => void>();

    return publishToastViewport({
      add(id: string, toast: TectonToastData) {
        const {title, body, type = 'info', durationMs, action} = toast;
        dismissers.set(
          id,
          showToastRef.current({
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
        );
      },
      remove(id: string) {
        dismissers.get(id)?.();
        dismissers.delete(id);
      },
    });
  }, []);

  return null;
}

ToastBridge.displayName = 'ToastBridge';
