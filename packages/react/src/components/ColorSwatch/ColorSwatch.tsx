/**
 * Tecton ColorSwatch.
 *
 * A small square of colour standing for a series, a facies, a horizon. It has
 * no counterpart underneath, so it is Tecton's own, written in StyleX against
 * the design tokens.
 *
 * The selected ring is lime — the one place in Tecton where selection is not
 * marked in the hot pink everything else focuses in.
 */
import type {MouseEventHandler} from 'react';
import * as stylex from '@stylexjs/stylex';
import {colorVars, radiusVars} from '@astryxdesign/core/theme/tokens.stylex';

const styles = stylex.create({
  root: {
    display: 'inline-block',
    flexShrink: 0,
    padding: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-inner'],
    backgroundColor: 'transparent',
  },
  interactive: {
    cursor: {default: 'pointer', ':disabled': 'not-allowed'},
  },
  selected: {
    // Lime, Tecton's selection ring; drawn outside the swatch so it never eats
    // into the colour being shown.
    outlineColor: 'var(--tecton-color-accent-lime)',
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineOffset: '2px',
    borderColor: 'var(--tecton-color-accent-lime)',
  },
});

export interface ColorSwatchProps {
  /** The colour to show, as any CSS colour value. */
  color: string;
  /**
   * Side length in pixels. Tecton draws 12 where the swatch stands alone and 6
   * where it sits inside a line of text.
   * @default 12
   */
  size?: number;
  /**
   * Draws the lime selection ring.
   * @default false
   */
  isSelected?: boolean;
  /**
   * Accessible name — what this colour stands for, not the colour's value.
   * Required for a swatch that can be chosen; on a decorative swatch it is
   * announced as an image.
   */
  label?: string;
  /** Click handler. Makes the swatch a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Prevents interaction.
   * @default false
   */
  isDisabled?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function ColorSwatch({
  color,
  size = 12,
  isSelected = false,
  label,
  onClick,
  isDisabled = false,
  'data-testid': testId,
}: ColorSwatchProps) {
  const style = {backgroundColor: color, width: size, height: size};
  const styleProps = stylex.props(
    styles.root,
    onClick !== undefined && styles.interactive,
    isSelected && styles.selected,
  );

  if (onClick !== undefined) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={isSelected}
        disabled={isDisabled}
        onClick={onClick}
        data-testid={testId}
        data-tecton-color-swatch=""
        {...styleProps}
        style={{...styleProps.style, ...style}}
      />
    );
  }

  return (
    <span
      role={label === undefined ? undefined : 'img'}
      aria-label={label}
      aria-hidden={label === undefined ? true : undefined}
      data-testid={testId}
      data-tecton-color-swatch=""
      {...styleProps}
      style={{...styleProps.style, ...style}}
    />
  );
}

ColorSwatch.displayName = 'ColorSwatch';
