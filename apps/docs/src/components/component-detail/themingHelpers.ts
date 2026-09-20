/**
 * Shaping a component's theming doc into the table the page prints.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/themingHelpers.ts`. The class names keep the
 * library's own namespace on purpose: they are what a consumer reads in
 * DevTools and what a `defineTheme` target is keyed on, so renaming them here
 * would document something that matches nothing.
 */

import type {
  ComponentVar,
  DocProp,
  ThemingDoc,
  ThemingTarget,
} from '@/types/docs';

const NAMESPACE_PREFIX = 'astryx-';

/** The key a target takes in a `defineTheme` `components` map. */
export function configKey(target: ThemingTarget): string {
  return target.className.startsWith(NAMESPACE_PREFIX)
    ? target.className.slice(NAMESPACE_PREFIX.length)
    : target.className;
}

/** Kebab-case a visual-prop or state name into its reflected `data-*` attribute. */
export function dataAttrForName(name: string): string {
  return `data-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

/** Every `data-*` attribute a target reflects, from its visual props and states. */
export function targetDataAttributes(target: ThemingTarget): string[] {
  return [
    ...(target.visualProps ?? []).map(dataAttrForName),
    ...(target.states ?? []).map(dataAttrForName),
  ];
}

/**
 * The values to print in a target's Props column. A `variant` visual prop is
 * expanded to the literals the component's own `variant` prop accepts.
 */
export function targetPropValues(
  target: ThemingTarget,
  props: readonly DocProp[],
): string[] {
  if (!target.visualProps?.length) return [];
  if (target.visualProps.includes('variant')) {
    const variantProp = props.find(prop => prop.name === 'variant');
    if (variantProp && variantProp.type.includes('|')) {
      return variantProp.type
        .replace(/['"]/g, '')
        .split('|')
        .map(value => value.trim())
        .filter(Boolean);
    }
  }
  return target.visualProps;
}

export function canonicalTargets(theming: ThemingDoc): ThemingTarget[] {
  return theming.targets.filter(target => !target.deprecatedFor);
}

/** The `defineTheme` snippet the page offers to copy. */
export function buildDefineThemeExample(theming: ThemingDoc): string {
  const targets = canonicalTargets(theming);
  if (targets.length === 0) return '';

  const lines = ['components: {'];
  const root = targets[0];
  lines.push(`  '${configKey(root)}': {`);
  lines.push(`    base: { /* CSS properties */ },`);
  if (root.visualProps?.length) {
    lines.push(`    '${root.visualProps[0]}:value': { /* prop-specific */ },`);
  }
  if (root.states?.length) {
    lines.push(`    '${root.states[0]}': { /* state-specific */ },`);
  }
  lines.push('  },');

  if (targets.length > 1) {
    const sub = targets[1];
    lines.push(`  '${configKey(sub)}': {`);
    lines.push(`    base: { /* CSS properties */ },`);
    if (sub.states?.length) {
      lines.push(`    '${sub.states[0]}': { /* state-specific */ },`);
    }
    lines.push('  },');
  }

  lines.push('}');
  return lines.join('\n');
}

/** Custom properties a consumer may set directly; derived ones are computed. */
export function publicVars(theming: ThemingDoc): ComponentVar[] {
  return (theming.vars ?? []).filter(entry => !entry.derived);
}

/** Whether a component has a themeable surface worth printing at all. */
export function hasThemingContent(theming: ThemingDoc | null): boolean {
  if (!theming) return false;
  return theming.targets.length > 0 || publicVars(theming).length > 0;
}
