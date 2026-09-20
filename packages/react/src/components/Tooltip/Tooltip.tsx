/**
 * Tecton Tooltip.
 *
 * A short note revealed on hover and keyboard focus. It supplements the thing
 * it points at — never put anything in it that the interface cannot be used
 * without.
 */
import type {ReactNode} from 'react';
import {Tooltip as BaseTooltip} from '@astryxdesign/core/Tooltip';

/** Which side of the trigger the tooltip appears on. */
export type TooltipPlacement = 'above' | 'below' | 'start' | 'end';

/** How the tooltip lines up along the placement axis. */
export type TooltipAlignment = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** The element the tooltip describes. */
  children: ReactNode;
  /** The note itself. Keep it to a line or two. */
  content: ReactNode;
  /**
   * Which side of the trigger the tooltip appears on.
   * @default 'above'
   */
  placement?: TooltipPlacement;
  /**
   * How the tooltip lines up along the placement axis.
   * @default 'center'
   */
  alignment?: TooltipAlignment;
  /**
   * How long the pointer must rest before the tooltip opens, in milliseconds.
   * @default 200
   */
  delayMs?: number;
  /**
   * Whether the tooltip responds at all — turn it off rather than swapping the
   * tree when a note is conditional.
   * @default true
   */
  isEnabled?: boolean;
}

export function Tooltip({
  children,
  content,
  placement = 'above',
  alignment = 'center',
  delayMs = 200,
  isEnabled = true,
}: TooltipProps) {
  return (
    <BaseTooltip
      content={content}
      placement={placement}
      alignment={alignment}
      delay={delayMs}
      isEnabled={isEnabled}
    >
      {children}
    </BaseTooltip>
  );
}

Tooltip.displayName = 'Tooltip';
