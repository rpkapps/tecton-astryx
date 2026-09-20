/**
 * Resolving an icon a consumer handed to a Tecton component.
 *
 * Tecton props that take an icon accept a glyph **name** — `icon="drill-bit"` —
 * or any SVG component, so nothing a Tecton component needs is ever reached
 * for outside `@tecton/react`. These two helpers turn that into the two shapes
 * the components underneath want: an element for a content slot, a component
 * for a slot that applies its own sizing.
 */
import type {ReactNode} from 'react';
import {Icon} from '../components/Icon/Icon.js';
import {tectonIconRegistry} from './registry.js';
import type {TectonIconGlyph, TectonIconSize} from './glyph.js';
import type {TectonIconName} from './names.js';

/** A Tecton glyph: named from the icon set, or supplied as an SVG component. */
export type TectonIconRef = TectonIconName | TectonIconGlyph;

/** The glyph component behind an icon reference. */
export function resolveIcon(icon: TectonIconRef): TectonIconGlyph;
export function resolveIcon(
  icon: TectonIconRef | undefined,
): TectonIconGlyph | undefined;
export function resolveIcon(
  icon: TectonIconRef | undefined,
): TectonIconGlyph | undefined {
  if (icon === undefined) return undefined;
  return typeof icon === 'string' ? tectonIconRegistry[icon] : icon;
}

/** An icon reference rendered as an element, for a slot that takes content. */
export function renderIcon(
  icon: TectonIconRef | undefined,
  size: TectonIconSize = 16,
): ReactNode {
  if (icon === undefined) return undefined;
  if (typeof icon === 'string') return <Icon name={icon} size={size} />;
  const Glyph = icon;
  return <Glyph width={size} height={size} aria-hidden="true" />;
}
