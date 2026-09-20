/**
 * Turning the element descriptors in a doc into real React elements.
 *
 * A doc describes a slot's contents as data — `{__element: 'Icon', props:
 * {icon: 'check'}}` — because a `.doc.mjs` cannot hold JSX. The playground
 * resolves those against the package's own exports at runtime, so what a knob
 * puts in a slot is the component itself.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/resolveElements.ts`.
 */

import {
  cloneElement,
  createElement,
  isValidElement,
  type ComponentType,
} from 'react';
import * as Tecton from '@tecton/react';
import type {ElementDescriptor} from '@/types/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/** Look a component up on the package's root export by name. */
export function getComponent(name: string): AnyComponent | null {
  let value: unknown;
  try {
    value = (Tecton as Record<string, unknown>)[name];
  } catch {
    value = undefined;
  }
  return typeof value === 'function' ||
    (value != null && typeof value === 'object')
    ? (value as AnyComponent)
    : null;
}

export function isElementDescriptor(
  value: unknown,
): value is ElementDescriptor {
  return value != null && typeof value === 'object' && '__element' in value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object' || isValidElement(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function withArrayKey(node: unknown, key: number): unknown {
  if (isValidElement(node) && node.key == null) {
    return cloneElement(node, {key});
  }
  return node;
}

export function resolveElementDescriptor(
  descriptor: ElementDescriptor,
): React.ReactNode {
  const Component = getComponent(descriptor.__element);
  const tag = Component ?? descriptor.__element;

  const resolvedProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(descriptor.props ?? {})) {
    resolvedProps[key] = resolveValue(value);
  }

  const children =
    descriptor.children == null
      ? undefined
      : (resolveValue(descriptor.children) as React.ReactNode);

  return createElement(tag, resolvedProps, children);
}

export function resolveValue(value: unknown): unknown {
  if (isElementDescriptor(value)) return resolveElementDescriptor(value);

  if (Array.isArray(value)) {
    return value.map((item, index) => withArrayKey(resolveValue(item), index));
  }

  if (isPlainObject(value)) {
    const resolved: Record<string, unknown> = {};
    let changed = false;
    for (const [key, item] of Object.entries(value)) {
      const next = resolveValue(item);
      resolved[key] = next;
      changed ||= next !== item;
    }
    return changed ? resolved : value;
  }

  return value;
}
