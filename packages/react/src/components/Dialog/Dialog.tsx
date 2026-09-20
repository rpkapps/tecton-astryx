/**
 * Tecton Dialog.
 *
 * One component for both shapes a Tecton dialog takes: an ordinary modal with
 * content and a footer, and a confirmation that states a consequence and
 * offers one action against it.
 *
 * Open and close live in one place on purpose — `isOpen` and `onOpenChange`.
 * Everything a later phase adds around dialogs (page-level coordination, one
 * dialog at a time) hangs off those two props, so applications never have to
 * change how they open a dialog.
 */
import type {ReactNode} from 'react';
import {Dialog as BaseDialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {AlertDialog} from '@astryxdesign/core/AlertDialog';

/** How much of the viewport the dialog takes. */
export type DialogSize = 'standard' | 'fullscreen';

/** How easily the dialog can be dismissed without answering it. */
export type DialogDismissal = 'info' | 'form' | 'required';

/** The action a confirmation dialog asks for. */
export interface DialogConfirmation {
  /** What happens if the action is taken. Stated plainly, in one sentence. */
  description: string;
  /** What the action is called. */
  actionLabel: string;
  /** Called when the action is taken. Closing is yours to do. */
  onAction: () => void;
  /**
   * What the way out is called.
   * @default 'Cancel'
   */
  cancelLabel?: string;
  /**
   * Draws the action as destructive.
   * @default true
   */
  isDestructive?: boolean;
  /**
   * Shows a spinner on the action while it is in flight.
   * @default false
   */
  isActionLoading?: boolean;
}

export interface DialogProps {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** Called with the new open state whenever the dialog opens or closes. */
  onOpenChange: (isOpen: boolean) => void;
  /** The dialog's title. It names the dialog for assistive technology. */
  title: string;
  /** A second line under the title. Ignored on a confirmation dialog. */
  subtitle?: string;
  /** The dialog's content. Ignored on a confirmation dialog. */
  children?: ReactNode;
  /** Actions at the foot of the dialog. Ignored on a confirmation dialog. */
  footer?: ReactNode;
  /** When set, the dialog is a confirmation rather than a content dialog. */
  confirmation?: DialogConfirmation;
  /**
   * How much of the viewport the dialog takes.
   * @default 'standard'
   */
  size?: DialogSize;
  /**
   * How easily the dialog can be dismissed without answering it: `info` closes
   * on Escape and on a click outside, `form` keeps the click outside from
   * closing it once it has been typed in, and `required` allows neither.
   * @default 'info'
   */
  dismissal?: DialogDismissal;
  /** Preferred width — a number is pixels, a string is used as-is. */
  width?: number | string;
  /**
   * Gives the header a close button.
   * @default true
   */
  hasCloseButton?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  confirmation,
  size = 'standard',
  dismissal = 'info',
  width,
  hasCloseButton = true,
  'data-testid': testId,
}: DialogProps) {
  if (confirmation !== undefined) {
    return (
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        description={confirmation.description}
        actionLabel={confirmation.actionLabel}
        onAction={confirmation.onAction}
        cancelLabel={confirmation.cancelLabel}
        actionVariant={
          confirmation.isDestructive === false ? 'primary' : 'destructive'
        }
        isActionLoading={confirmation.isActionLoading}
        width={width}
        data-testid={testId}
      />
    );
  }

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant={size}
      purpose={dismissal}
      width={width}
      data-testid={testId}
    >
      <DialogHeader
        title={title}
        subtitle={subtitle}
        onOpenChange={hasCloseButton ? onOpenChange : undefined}
      />
      {children}
      {footer}
    </BaseDialog>
  );
}

Dialog.displayName = 'Dialog';
