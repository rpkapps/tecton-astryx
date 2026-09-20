/**
 * Tecton Fab.
 *
 * The one action a screen is really for, lifted off the surface and pinned
 * where it can always be reached. A screen has at most one.
 *
 * `round` is the icon-only circle; `extended` carries a label beside the
 * glyph. The shadow is the only one in Tecton — every other surface is flat.
 */
import type {MouseEventHandler} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

/** Which shape the action takes. */
export type FabShape = 'round' | 'extended';

/** Visual emphasis, matching Button. */
export type FabVariant = 'primary' | 'secondary' | 'tertiary' | 'outlined';

/** How far the action is lifted off the surface. */
export type FabElevation = 'low' | 'med' | 'high';

const VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'ghost',
  outlined: 'outlined',
} as const satisfies Record<FabVariant, string>;

export interface FabProps {
  /**
   * What the action does. Visible text on an `extended` action, the accessible
   * name on a `round` one.
   */
  label: string;
  /** The glyph, by name or as an SVG component. */
  icon: TectonIconRef;
  /**
   * Which shape the action takes.
   * @default 'round'
   */
  shape?: FabShape;
  /**
   * Visual emphasis.
   * @default 'primary'
   */
  variant?: FabVariant;
  /**
   * How far the action is lifted off the surface.
   * @default 'med'
   */
  elevation?: FabElevation;
  /**
   * Prevents interaction and recesses the fill.
   * @default false
   */
  isDisabled?: boolean;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function Fab({
  label,
  icon,
  shape = 'round',
  variant = 'primary',
  elevation = 'med',
  isDisabled = false,
  onClick,
  'data-testid': testId,
}: FabProps) {
  const glyph = renderIcon(icon, 20);

  return shape === 'extended' ? (
    <Button
      label={label}
      icon={glyph}
      variant={VARIANT[variant]}
      elevation={elevation}
      isDisabled={isDisabled}
      onClick={onClick}
      data-testid={testId}
    />
  ) : (
    <IconButton
      label={label}
      icon={glyph}
      variant={VARIANT[variant]}
      elevation={elevation}
      isDisabled={isDisabled}
      onClick={onClick}
      data-testid={testId}
    />
  );
}

Fab.displayName = 'Fab';
