/**
 * Tecton Alert.
 *
 * A message about the state of the system, addressed to the person using it.
 * The status sets the colour and the glyph; five statuses, from `info` through
 * `error` to the colourless `neutral`.
 */
import type {ReactNode} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

/** What kind of message this is. */
export type AlertStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';

/** Whether the alert sits in the content or spans the page. */
export type AlertPlacement = 'inline' | 'page';

export interface AlertProps {
  /** What kind of message this is. */
  status: AlertStatus;
  /** The headline — the message in one line. */
  title: ReactNode;
  /** Supporting detail under the title. */
  description?: ReactNode;
  /** Glyph shown instead of the status glyph. */
  icon?: TectonIconRef;
  /** Controls aligned to the end of the alert, such as a single action. */
  actions?: ReactNode;
  /**
   * Whether the alert sits in the flow of the content (rounded) or spans the
   * page edge to edge.
   * @default 'inline'
   */
  placement?: AlertPlacement;
  /**
   * Gives the alert a dismiss button.
   * @default false
   */
  isDismissable?: boolean;
  /** Called when the alert is dismissed. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss button. */
  dismissLabel?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Alert({
  status,
  title,
  description,
  icon,
  actions,
  placement = 'inline',
  isDismissable = false,
  onDismiss,
  dismissLabel,
  'data-testid': testId,
}: AlertProps) {
  return (
    <Banner
      status={status}
      title={title}
      description={description}
      icon={renderIcon(icon, 20)}
      endContent={actions}
      container={placement === 'page' ? 'section' : 'card'}
      isDismissable={isDismissable}
      onDismiss={onDismiss}
      dismissLabel={dismissLabel}
      // A Tecton alert is a single block of message; it has no disclosed body,
      // so there is never an expand toggle in the header.
      collapsible={false}
      data-testid={testId}
    />
  );
}

Alert.displayName = 'Alert';
