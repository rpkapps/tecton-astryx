/**
 * Tecton Link.
 *
 * Tecton links are the colour of the text around them — the underline is the
 * whole affordance. `underline="hover"` reveals it on hover and focus;
 * `underline="always"` keeps it, which is what a link inside a paragraph
 * needs.
 */
import type {MouseEventHandler, ReactNode} from 'react';
import {Link as BaseLink} from '@astryxdesign/core/Link';
import {TEXT_WEIGHT, type TextColor, type TextWeight} from '../Text/Text.js';

/** When the underline is drawn. */
export type LinkUnderline = 'hover' | 'always';

export interface LinkProps {
  /** The link text. */
  children: ReactNode;
  /** Where the link goes. */
  href?: string;
  /**
   * When the underline is drawn.
   * @default 'hover'
   */
  underline?: LinkUnderline;
  /**
   * Ink role. Tecton links take the colour of the text around them.
   * @default 'primary'
   */
  color?: TextColor;
  /** Font weight, overriding the weight of the surrounding text. */
  weight?: TextWeight;
  /**
   * Prevents interaction and dims the link.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Opens the link in a new tab, with an icon, the safe `rel` tokens and a
   * screen-reader note saying so.
   * @default false
   */
  isExternal?: boolean;
  /**
   * Accessible name, for a link whose content does not describe where it goes.
   */
  label?: string;
  /** Short text shown on hover and keyboard focus. */
  tooltip?: string;
  /** Click handler. */
  onClick?: MouseEventHandler;
  /** Test hook. */
  'data-testid'?: string;
}

export function Link({
  children,
  href,
  underline = 'hover',
  color = 'primary',
  weight,
  isDisabled = false,
  isExternal = false,
  label,
  tooltip,
  onClick,
  'data-testid': testId,
}: LinkProps) {
  return (
    <BaseLink
      href={href}
      hasUnderline={underline === 'always'}
      color={color}
      weight={weight === undefined ? undefined : TEXT_WEIGHT[weight]}
      isDisabled={isDisabled}
      isExternalLink={isExternal}
      label={label}
      tooltip={tooltip}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </BaseLink>
  );
}

Link.displayName = 'Link';
