/**
 * A stringified TypeScript prop type, turned into a control the playground can
 * draw an input for.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/parsePropType.ts`. Literal unions become
 * enums, mixed string-literal and boolean unions keep their typed values, and
 * anything the parser cannot make sense of is left alone rather than guessed
 * at — an unknown control renders no knob and the preview uses the doc default.
 */

import {getIconRegistry} from '@tecton/react/Icon';

export interface ElementOption {
  label: string;
  componentName: string;
}

type InputStatusOption = 'error' | 'warning' | 'success';

export type EnumOptionValue = string | number | boolean;

export interface EnumPropControlDescriptor {
  kind: 'enum';
  options: string[];
  allowEmpty: boolean;
  optionValues?: Record<string, EnumOptionValue>;
}

export type PropControlDescriptor =
  | EnumPropControlDescriptor
  | {kind: 'input-status'; options: InputStatusOption[]; allowEmpty: boolean}
  | {kind: 'theme'}
  | {kind: 'syntax-theme'}
  | {kind: 'boolean'}
  | {kind: 'string'}
  | {kind: 'number'}
  | {kind: 'callback'}
  | {kind: 'element'; options: ElementOption[]}
  | {kind: 'slot-list'; options: ElementOption[]}
  | {kind: 'unknown'};

const STRING_LITERAL_RE = /^['"]([^'"]*)['"]$/;
const NUMBER_LITERAL_RE = /^-?\d+(\.\d+)?$/;
const CALLBACK_RE = /=>/;
const NODE_TYPE_RE = /\b(ReactNode|ReactElement|JSX\.Element|ReactChild)\b/;
const REACT_ELEMENT_RE = /ReactElement<(\w+)Props>/g;

const INPUT_STATUS_OPTIONS: InputStatusOption[] = [
  'error',
  'warning',
  'success',
];

function hasStringLiteral(typeStr: string, value: string): boolean {
  return new RegExp(`['"]${value}['"]`).test(typeStr);
}

function parseStatusOptions(typeStr: string): InputStatusOption[] {
  const literals = INPUT_STATUS_OPTIONS.filter(status =>
    hasStringLiteral(typeStr, status),
  );
  return literals.length > 0 ? literals : INPUT_STATUS_OPTIONS;
}

function isInputStatusType(typeStr: string, propName?: string): boolean {
  if (propName !== 'status') return false;
  if (/\b(?:InputStatus|FieldStatus)\b/.test(typeStr)) return true;
  return (
    typeStr.trim().startsWith('{') &&
    /\btype\s*:/.test(typeStr) &&
    INPUT_STATUS_OPTIONS.some(status => hasStringLiteral(typeStr, status))
  );
}

function splitUnion(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let inString: string | null = null;

  for (let i = 0; i < input.length; i += 1) {
    const character = input[i];
    if (inString) {
      if (character === inString && input[i - 1] !== '\\') inString = null;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      inString = character;
      continue;
    }
    if ('([{<'.includes(character)) depth += 1;
    else if (')]}>'.includes(character)) depth -= 1;
    else if (character === '|' && depth === 0) {
      parts.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(input.slice(start).trim());
  return parts.filter(part => part.length > 0);
}

export function parsePropType(
  typeStr: string,
  propName?: string,
  slotElements?: Array<{__element: string; props?: Record<string, unknown>}>,
): PropControlDescriptor {
  const type = (typeStr ?? '').trim();
  if (!type) return {kind: 'unknown'};

  // A status object is edited as a typed validation state, never as a slot
  // element — checked first so a stale descriptor cannot make the preview hand
  // a React element to a component expecting `{type, message}`.
  if (isInputStatusType(type, propName)) {
    return {
      kind: 'input-status',
      options: parseStatusOptions(type),
      allowEmpty: true,
    };
  }

  if (slotElements && slotElements.length > 0) {
    const options = slotElements.map(element => ({
      label: element.__element,
      componentName: element.__element,
    }));
    // `children` with slot elements is a repeatable list, not one slot.
    if (propName === 'children') return {kind: 'slot-list', options};
    return {kind: 'element', options};
  }

  if (CALLBACK_RE.test(type)) return {kind: 'callback'};
  if (type === 'boolean') return {kind: 'boolean'};
  if (type === 'string') return {kind: 'string'};
  if (type === 'number') return {kind: 'number'};

  if (type === 'SpacingStep') {
    return {
      kind: 'enum',
      options: ['0', '0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10'],
      allowEmpty: false,
    };
  }
  if (type === 'SizeValue') return {kind: 'number'};
  if (type === 'DefinedTheme') return {kind: 'theme'};
  if (type === 'SyntaxTheme') return {kind: 'syntax-theme'};
  if (type === 'IconType' || type === 'IconName') {
    return {
      kind: 'enum',
      options: Object.keys(getIconRegistry()),
      allowEmpty: true,
    };
  }
  if (type === 'AppShellBreakpoint') {
    return {
      kind: 'enum',
      options: ['sm', 'md', 'lg', 'none'],
      allowEmpty: false,
    };
  }

  const elementMatches: ElementOption[] = [];
  REACT_ELEMENT_RE.lastIndex = 0;
  let match = REACT_ELEMENT_RE.exec(type);
  while (match !== null) {
    elementMatches.push({label: match[1], componentName: match[1]});
    match = REACT_ELEMENT_RE.exec(type);
  }
  if (elementMatches.length > 0)
    return {kind: 'element', options: elementMatches};

  if (NODE_TYPE_RE.test(type)) {
    const isIconProp =
      propName != null &&
      /^(icon|startIcon|endIcon|leftIcon|rightIcon)$/i.test(propName);
    if (isIconProp) {
      return {
        kind: 'element',
        options: [{label: 'Icon', componentName: 'Icon'}],
      };
    }
    return {kind: 'string'};
  }

  const parts = splitUnion(type);
  const nonNullish = parts.filter(
    part => part !== 'null' && part !== 'undefined',
  );
  if (
    nonNullish.length > 0 &&
    nonNullish.every(part => part === 'string' || part === 'number')
  ) {
    return {kind: 'string'};
  }

  const literals: string[] = [];
  const optionValues: Record<string, EnumOptionValue> = {};
  let allowEmpty = false;
  let onlyLiterals = true;
  let hasNonBooleanLiteral = false;
  let hasOptionValueOverrides = false;

  const addLiteral = (value: string) => {
    if (!literals.includes(value)) literals.push(value);
  };
  const addOptionValue = (option: string, value: EnumOptionValue) => {
    optionValues[option] = value;
    hasOptionValueOverrides = true;
  };

  for (const part of parts) {
    if (part === 'undefined' || part === 'null') {
      allowEmpty = true;
      continue;
    }
    if (part === 'boolean') {
      addLiteral('true');
      addLiteral('false');
      addOptionValue('true', true);
      addOptionValue('false', false);
      continue;
    }
    const literal = STRING_LITERAL_RE.exec(part);
    if (literal) {
      hasNonBooleanLiteral = true;
      addLiteral(literal[1]);
    } else if (NUMBER_LITERAL_RE.test(part)) {
      hasNonBooleanLiteral = true;
      addLiteral(part);
    } else if (part === 'true' || part === 'false') {
      addLiteral(part);
      addOptionValue(part, part === 'true');
    } else {
      onlyLiterals = false;
      break;
    }
  }

  if (onlyLiterals && literals.length >= 2) {
    if (!hasNonBooleanLiteral) return {kind: 'boolean'};
    return {
      kind: 'enum',
      options: literals,
      allowEmpty,
      ...(hasOptionValueOverrides ? {optionValues} : {}),
    };
  }

  return {kind: 'unknown'};
}

export function coerceEnumOption(
  control: EnumPropControlDescriptor,
  option: string,
): EnumOptionValue {
  if (
    control.optionValues != null &&
    Object.prototype.hasOwnProperty.call(control.optionValues, option)
  ) {
    return control.optionValues[option];
  }
  return option;
}

export function coerceDefault(
  raw: string | undefined,
  control: PropControlDescriptor,
): unknown {
  if (raw == null) return undefined;
  const value = raw.trim();
  if (!value) return undefined;

  switch (control.kind) {
    case 'boolean':
      return value === 'true';
    case 'number': {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    case 'enum': {
      const literal = STRING_LITERAL_RE.exec(value);
      const stripped = literal ? literal[1] : value;
      return control.options.includes(stripped)
        ? coerceEnumOption(control, stripped)
        : undefined;
    }
    case 'string': {
      const literal = STRING_LITERAL_RE.exec(value);
      return literal ? literal[1] : value;
    }
    case 'input-status': {
      const literal = STRING_LITERAL_RE.exec(value);
      const stripped = literal ? literal[1] : value;
      return control.options.includes(stripped as InputStatusOption)
        ? {type: stripped, message: `${stripped} status`}
        : undefined;
    }
    default:
      return undefined;
  }
}
