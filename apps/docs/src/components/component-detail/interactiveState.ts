/**
 * The state behind a component page's playground.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/interactiveState.ts`: build the knobs from
 * the doc's props, seed them from the doc's defaults, and wire a controlled
 * component's change handler back into that state so the preview reacts to
 * being used rather than only to the knobs.
 *
 * Tecton ships one theme, so the theme and syntax-theme controls resolve
 * against `tectonTheme` and the package's syntax presets rather than against a
 * gallery of theme packages.
 */

import {allSyntaxPresets} from '@tecton/react/theme/syntax';
import {tectonTheme} from '@tecton/react/theme';
import {
  coerceDefault,
  coerceEnumOption,
  parsePropType,
  type PropControlDescriptor,
} from './parsePropType';
import {resolveValue} from './resolveElements';
import type {ComponentEntry, DocProp, PlaygroundConfig} from '@/types/docs';

export interface KnobProp {
  row: DocProp;
  control: PropControlDescriptor;
}

const PREVIEW_SEARCH_ITEMS = [
  {id: 'dashboard', label: 'Dashboard'},
  {id: 'projects', label: 'Projects'},
  {id: 'settings', label: 'Settings'},
];

const PREVIEW_SEARCH_SOURCE = {
  search(query: string) {
    const normalized = query.trim().toLowerCase();
    if (normalized === '') return PREVIEW_SEARCH_ITEMS;
    return PREVIEW_SEARCH_ITEMS.filter(item =>
      item.label.toLowerCase().includes(normalized),
    );
  },
  bootstrap() {
    return PREVIEW_SEARCH_ITEMS;
  },
  cancel() {},
};

export function pickPrimaryProps(props: readonly DocProp[]): KnobProp[] {
  return props.map(row => ({
    row,
    control: parsePropType(row.type, row.name, row.slotElements),
  }));
}

function resolveThemeValue(value: unknown): unknown {
  return typeof value === 'string' ? tectonTheme : resolveValue(value);
}

function resolveSyntaxThemeValue(value: unknown): unknown {
  if (typeof value !== 'string') return resolveValue(value);
  return allSyntaxPresets.find(theme => theme.name === value) ?? value;
}

function resolveDefaultValue(
  value: unknown,
  control: PropControlDescriptor | undefined,
): unknown {
  if (control?.kind === 'theme') return resolveThemeValue(value);
  if (control?.kind === 'syntax-theme') return resolveSyntaxThemeValue(value);
  return resolveValue(value);
}

function buildSlotListDefault(row: DocProp): unknown[] | undefined {
  const slot = row.slotElements?.[0];
  if (!slot) return undefined;
  return [1, 2, 3].map(index => {
    const props = {...(slot.props ?? {})};
    if (typeof props.label === 'string')
      props.label = `${props.label} ${index}`;
    if (typeof props.value === 'string')
      props.value = `${props.value}-${index}`;
    const children =
      typeof slot.children === 'string'
        ? `${slot.children} ${index}`
        : slot.children;
    return resolveValue({...slot, props, children});
  });
}

function getRequiredFallbackValue(
  row: DocProp,
  control: PropControlDescriptor,
): unknown {
  switch (control.kind) {
    case 'enum':
      return coerceEnumOption(control, control.options[0]);
    case 'theme':
      return tectonTheme;
    case 'syntax-theme':
      return allSyntaxPresets[0];
    case 'input-status':
      return {
        type: control.options[0],
        message: `${control.options[0]} status`,
      };
    case 'boolean':
      return false;
    case 'string':
      return row.name;
    case 'number':
      return 0;
    case 'callback':
      return () => {};
    case 'element':
      return row.slotElements?.[0] != null
        ? resolveValue(row.slotElements[0])
        : undefined;
    case 'slot-list':
      return buildSlotListDefault(row);
    default:
      if (/\bSearchSource\b/.test(row.type)) return PREVIEW_SEARCH_SOURCE;
      if (/\bnull\b/.test(row.type)) return null;
      return undefined;
  }
}

export function buildInitialState(
  knobs: readonly KnobProp[],
  playground?: PlaygroundConfig | null,
): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  const controlByName = new Map(
    knobs.map(({row, control}) => [row.name, control]),
  );

  for (const [key, value] of Object.entries(playground?.defaults ?? {})) {
    state[key] = resolveDefaultValue(value, controlByName.get(key));
  }

  for (const {row, control} of knobs) {
    if (state[row.name] !== undefined) continue;
    const fromDoc = coerceDefault(row.default, control);
    if (fromDoc !== undefined) {
      state[row.name] = fromDoc;
    } else if (control.kind === 'slot-list') {
      const items = buildSlotListDefault(row);
      if (items !== undefined) state[row.name] = items;
    } else if (row.required) {
      const fallback = getRequiredFallbackValue(row, control);
      if (fallback !== undefined) state[row.name] = fallback;
    }
  }
  return state;
}

/**
 * Whether a page draws the playground at all. A hook documents its signature
 * instead, and a non-visual utility (a provider, a context) has nothing a knob
 * could change — unless its own doc curates a playground, as `Theme`'s does.
 */
export function hasInteractivePlayground(
  entry: Pick<ComponentEntry, 'category' | 'isHook' | 'playground' | 'props'>,
): boolean {
  if (entry.isHook) return false;
  if (entry.props.length === 0) return false;
  return entry.category !== 'Utility' || entry.playground != null;
}

/** The prop and value the preview's own open button writes. */
export function getOverlayPreviewControl(
  playground: PlaygroundConfig | null | undefined,
): {stateProp: string; openValue: unknown} | null {
  if (playground?.overlay !== true) return null;
  return playground.overlayControl ?? {stateProp: 'isOpen', openValue: true};
}

/** True when an overlay component is closed, so the stage would be empty. */
export function isOverlayPreviewClosed(
  playground: PlaygroundConfig | null | undefined,
  state: Record<string, unknown>,
): boolean {
  const control = getOverlayPreviewControl(playground);
  return (
    control != null && !Object.is(state[control.stateProp], control.openValue)
  );
}

export function getMissingRequiredProps(
  knobs: readonly KnobProp[],
  state: Record<string, unknown>,
): string[] {
  return knobs
    .filter(({row}) => row.required === true && state[row.name] === undefined)
    .map(({row}) => row.name);
}

/** `(page: number) => void` → `page`; `null` when the parameter is unnamed. */
function getCallbackTargetProp(type: string): string | null {
  const match = /^\s*\(\s*([^):,]+)/.exec(type);
  if (!match) return null;
  const name = match[1].trim().replace(/\?$/, '');
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : null;
}

function resolveChangeTarget(
  name: string,
  type: string,
  state: Record<string, unknown>,
  knownProps: ReadonlySet<string>,
): string | null {
  const named = getCallbackTargetProp(type);
  if (
    named != null &&
    (named in state || (name === 'onChange' && knownProps.has(named)))
  ) {
    return named;
  }
  return name === 'onChange' && ('value' in state || knownProps.has('value'))
    ? 'value'
    : null;
}

/**
 * Wire a controlled component's change handlers back into playground state, so
 * clicking a page in Pagination or flipping a Switch actually moves the
 * preview. `onChange` is the exception to the name match: it documents its
 * parameter after the payload it carries, so it falls back to `value`.
 */
export function buildRuntimePreviewState(
  state: Record<string, unknown>,
  onPropChange?: (propName: string, value: unknown) => void,
  options?: {canControlOpenState?: boolean; knobs?: readonly KnobProp[]},
): Record<string, unknown> {
  if (onPropChange == null) return state;

  const knobs = options?.knobs ?? [];
  const knownProps = new Set(knobs.map(knob => knob.row.name));
  const next: Record<string, unknown> = {...state};
  let changed = false;

  for (const {row, control} of knobs) {
    if (control.kind !== 'callback') continue;
    if (!/^on[A-Z].*Change$/.test(row.name) && row.name !== 'onChange')
      continue;
    const target = resolveChangeTarget(row.name, row.type, state, knownProps);
    if (target == null) continue;
    if (target === 'isOpen' && options?.canControlOpenState !== true) continue;
    next[row.name] = (value: unknown) => onPropChange(target, value);
    changed = true;
  }

  if (
    !changed &&
    options?.canControlOpenState === true &&
    typeof state.isOpen === 'boolean'
  ) {
    next.onOpenChange = (isOpen: boolean) => onPropChange('isOpen', isOpen);
    return next;
  }

  return changed ? next : state;
}
