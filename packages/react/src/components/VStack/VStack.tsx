/**
 * Tecton VStack.
 *
 * A `Stack` that runs top to bottom. Everything else about it is the same.
 */
import {Stack, type StackProps} from '../Stack/Stack.js';

export type VStackProps = Omit<StackProps, 'direction'>;

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="vertical" />;
}

VStack.displayName = 'VStack';
