/**
 * Tecton HStack.
 *
 * A `Stack` that runs left to right. Everything else about it is the same.
 */
import {Stack, type StackProps} from '../Stack/Stack.js';

export type HStackProps = Omit<StackProps, 'direction'>;

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="horizontal" />;
}

HStack.displayName = 'HStack';
