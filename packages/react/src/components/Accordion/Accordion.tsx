/**
 * Tecton Accordion.
 *
 * One disclosure: a header that is always visible, and content that opens and
 * closes under it. Put several inside an `AccordionGroup` to coordinate them.
 *
 * The header is composed here — a glyph, a label and a secondary column — and
 * handed to the disclosure as its trigger.
 */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  colorVars,
  spacingVars,
  typeScaleVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacingVars['--spacing-2'],
    minWidth: 0,
    width: '100%',
  },
  icon: {display: 'inline-flex', flexShrink: 0},
  title: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: typeScaleVars['--text-label-weight'],
    color: colorVars['--color-text-primary'],
  },
  secondary: {
    flexShrink: 0,
    color: colorVars['--color-text-secondary'],
    fontSize: typeScaleVars['--text-supporting-size'],
  },
});

export interface AccordionProps {
  /** The header label, always visible. */
  title: ReactNode;
  /** The content that opens and closes. */
  children?: ReactNode;
  /** Glyph rendered before the title, by name or as an SVG component. */
  icon?: TectonIconRef;
  /** A second, quieter column in the header — a count, a status, a date. */
  secondaryText?: ReactNode;
  /** Identifier, required when the accordion sits inside an `AccordionGroup`. */
  value?: string;
  /** Open state, when the accordion is controlled. */
  isOpen?: boolean;
  /**
   * Open state on first render, when the accordion is uncontrolled.
   * @default true
   */
  defaultIsOpen?: boolean;
  /** Called with the new open state whenever it changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Prevents the header from being toggled. It does not close an open
   * accordion.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Which end of the header the disclosure chevron sits at.
   * @default 'end'
   */
  chevronPosition?: 'start' | 'end';
  /** Test hook. */
  'data-testid'?: string;
}

export function Accordion({
  title,
  children,
  icon,
  secondaryText,
  value,
  isOpen,
  defaultIsOpen = true,
  onOpenChange,
  isDisabled = false,
  chevronPosition = 'end',
  'data-testid': testId,
}: AccordionProps) {
  const trigger = (
    <span {...stylex.props(styles.header)}>
      {icon !== undefined ? (
        <span {...stylex.props(styles.icon)}>{renderIcon(icon, 20)}</span>
      ) : null}
      <span {...stylex.props(styles.title)}>{title}</span>
      {secondaryText !== undefined ? (
        <span {...stylex.props(styles.secondary)}>{secondaryText}</span>
      ) : null}
    </span>
  );

  return (
    <Collapsible
      trigger={trigger}
      value={value}
      isOpen={isOpen}
      defaultIsOpen={defaultIsOpen}
      onOpenChange={onOpenChange}
      isDisabled={isDisabled}
      chevronPosition={chevronPosition}
      data-testid={testId}
    >
      {children}
    </Collapsible>
  );
}

Accordion.displayName = 'Accordion';
