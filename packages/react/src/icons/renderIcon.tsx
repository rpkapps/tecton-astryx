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

/**
 * Let a pass-through prop take a Tecton glyph name as well as whatever it
 * already took.
 *
 * A generated wrapper publishes the component underneath it unchanged, so its
 * icon props keep accepting what they always accepted — an element, a glyph
 * component, a slot's own icon type. These two helpers **widen** those props
 * rather than replacing them: a Tecton glyph name is resolved, anything else
 * is handed through untouched. That is what lets `icon="drill-bit"` and
 * `icon={<NavIcon …/>}` both work on the same prop, so a Tecton consumer gets
 * the Tecton icon set without losing the composition the component was built
 * for.
 *
 * They are deliberately typed in terms of `unknown`: the prop's own type is
 * whatever the component declares, and the generated wrapper casts back to it
 * at the one call site. A narrower signature here would have to name every
 * icon shape in the system.
 */
export function tectonIconValue(icon: unknown): unknown {
  if (typeof icon === 'string' && icon in tectonIconRegistry) {
    return tectonIconRegistry[icon as TectonIconName];
  }
  return icon;
}

/** The same widening for a slot that takes rendered content. */
export function tectonIconNode(
  icon: unknown,
  size: TectonIconSize = 16,
): unknown {
  if (typeof icon === 'string' && icon in tectonIconRegistry) {
    return <Icon name={icon as TectonIconName} size={size} />;
  }
  return icon;
}
