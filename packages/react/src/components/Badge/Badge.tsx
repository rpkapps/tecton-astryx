/**
 * Tecton Badge.
 *
 * A standalone pill that labels the thing next to it: a status, a count, a
 * category. It is not anchored to anything — it sits in the flow like a word.
 */
import type {ReactNode} from 'react';
import {Badge as BaseBadge} from '@astryxdesign/core/Badge';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

/** Colour role. The five semantic roles fill solid; the rest are tinted. */
export type BadgeVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'lime'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

export interface BadgeProps {
  /** The badge text. One line — longer text is cut with an ellipsis. */
  label: ReactNode;
  /**
   * Colour role.
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  /** Glyph rendered before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
}

export function Badge({label, variant = 'neutral', icon}: BadgeProps) {
  return (
    <BaseBadge label={label} variant={variant} icon={renderIcon(icon, 16)} />
  );
}

Badge.displayName = 'Badge';
