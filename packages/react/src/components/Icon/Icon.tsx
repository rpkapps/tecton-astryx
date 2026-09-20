/**
 * Tecton Icon.
 *
 * Renders one of the 131 Tecton glyphs at one of the three sizes the icon
 * foundation names. The artwork is generated from the design delivery into
 * `src/icons/generated/`; this component is the part a consumer sees.
 *
 * An icon is decorative by default and hidden from assistive technology. Pass
 * a `label` only when the glyph carries meaning no neighbouring text repeats —
 * a bare status mark, say — and never when the control around it is already
 * named.
 */
import * as stylex from '@stylexjs/stylex';
import {tectonIconRegistry} from '../../icons/registry.js';
import type {TectonIconName} from '../../icons/names.js';
import type {TectonIconSize, TectonIconVariant} from '../../icons/glyph.js';

const styles = stylex.create({
  root: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    color: 'currentColor',
  },
  size16: {fontSize: '16px'},
  size20: {fontSize: '20px'},
  size24: {fontSize: '24px'},
});

const SIZE_STYLE = {
  16: styles.size16,
  20: styles.size20,
  24: styles.size24,
} as const;

export interface IconProps {
  /** Which Tecton glyph to draw. */
  name: TectonIconName;
  /**
   * Which cut of the glyph to draw.
   * @default 'outline'
   */
  variant?: TectonIconVariant;
  /**
   * Rendered size, in pixels.
   * @default 16
   */
  size?: TectonIconSize;
  /**
   * Accessible name for a glyph that carries meaning on its own. Leave it unset
   * for decoration and the icon is hidden from assistive technology.
   */
  label?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Icon({
  name,
  variant = 'outline',
  size = 16,
  label,
  'data-testid': testId,
}: IconProps) {
  const Glyph = tectonIconRegistry[name];
  const isMeaningful = label !== undefined && label !== '';

  return (
    <Glyph
      variant={variant}
      role={isMeaningful ? 'img' : undefined}
      aria-label={isMeaningful ? label : undefined}
      aria-hidden={isMeaningful ? undefined : true}
      data-testid={testId}
      data-tecton-icon={name}
      {...stylex.props(styles.root, SIZE_STYLE[size])}
    />
  );
}

Icon.displayName = 'Icon';
