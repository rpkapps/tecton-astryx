'use client';

/**
 * The stage a playground draws on.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/InteractivePreview.tsx`. The component is
 * looked up on `@tecton/react` by name and rendered with the knobs' current
 * values; a Show code toggle prints the JSX those values amount to, so what the
 * reader is looking at can be copied as written.
 *
 * Upstream renders the stage under its neutral theme. Tecton's site renders it
 * under Tecton's, in a nested provider, with the same dark/light switch every
 * other preview on the page carries.
 */

import {
  Component,
  createElement,
  Suspense,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {Button} from '@tecton/react/Button';
import {Center} from '@tecton/react/Center';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Icon} from '@tecton/react/Icon';
import {CodeIcon} from '@tecton/react/icons';
import type {DocProp, PlaygroundConfig} from '@/types/docs';
import {PreviewFrame} from '../docs/preview-frame';
import {CodeBlock} from './CodeBlock';
import {getComponent, resolveValue} from './resolveElements';
import {
  buildInitialState,
  buildRuntimePreviewState,
  getMissingRequiredProps,
  getOverlayPreviewControl,
  isOverlayPreviewClosed,
  pickPrimaryProps,
  type KnobProp,
} from './interactiveState';

export type {KnobProp} from './interactiveState';

class PreviewErrorBoundary extends Component<
  {children: ReactNode; resetKeys: unknown[]},
  {error: Error | null}
> {
  state = {error: null as Error | null};

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  componentDidUpdate(prevProps: {resetKeys: unknown[]}) {
    if (
      this.state.error &&
      prevProps.resetKeys.some(
        (key, i) => !Object.is(key, this.props.resetKeys[i]),
      )
    ) {
      this.setState({error: null});
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Text type="supporting" color="secondary">
          Render error: {this.state.error.message}
        </Text>
      );
    }
    return this.props.children;
  }
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '/* … */';
  }
}

function generateCode(name: string, state: Record<string, unknown>): string {
  const entries = Object.entries(state).filter(
    ([, value]) => value !== undefined,
  );
  if (entries.length === 0) return `<${name} />`;

  const lines = entries.map(([key, value]) => {
    if (value === true) return `  ${key}`;
    if (typeof value === 'string') return `  ${key}="${value}"`;
    return `  ${key}={${formatValue(value)}}`;
  });
  return `<${name}\n${lines.join('\n')}\n/>`;
}

export function useInteractiveState(
  props: readonly DocProp[],
  playground?: PlaygroundConfig | null,
) {
  const knobs = useMemo(() => pickPrimaryProps(props), [props]);
  const initialState = useMemo(
    () => buildInitialState(knobs, playground),
    [knobs, playground],
  );
  const [state, setState] = useState<Record<string, unknown>>(initialState);
  const missingRequiredProps = useMemo(
    () => getMissingRequiredProps(knobs, initialState),
    [knobs, initialState],
  );

  const setProp = useCallback(
    (propName: string, value: unknown) =>
      setState(prev => ({...prev, [propName]: value})),
    [],
  );
  const reset = useCallback(() => setState(initialState), [initialState]);

  return {knobs, state, setProp, reset, missingRequiredProps};
}

function Placeholder({children}: {children: ReactNode}) {
  return (
    <Center style={{minHeight: 200, width: '100%'}}>
      <VStack
        gap={1}
        style={{paddingBlock: 24, paddingInline: 16, textAlign: 'center'}}
      >
        {children}
      </VStack>
    </Center>
  );
}

export function InteractivePreviewStage({
  name,
  state,
  knobs,
  playground,
  missingRequiredProps = [],
  onPropChange,
  canControlOpenState = false,
}: {
  name: string;
  state: Record<string, unknown>;
  knobs?: readonly KnobProp[];
  playground?: PlaygroundConfig | null;
  missingRequiredProps?: readonly string[];
  onPropChange?: (propName: string, value: unknown) => void;
  canControlOpenState?: boolean;
}) {
  const [showCode, setShowCode] = useState(false);
  const Previewed = getComponent(name);
  const runtimeState = useMemo(
    () =>
      resolveValue(
        buildRuntimePreviewState(state, onPropChange, {
          canControlOpenState,
          knobs,
        }),
      ) as Record<string, unknown>,
    [state, onPropChange, canControlOpenState, knobs],
  );

  const wrapper = playground?.wrapper ?? null;
  const overlayControl = getOverlayPreviewControl(playground);
  const WrapperComponent = wrapper ? getComponent(wrapper.component) : null;
  const [wrapperValue, setWrapperValue] = useState<unknown>(undefined);

  const wrapperProps = useMemo(() => {
    const resolved = wrapper?.props
      ? (resolveValue(wrapper.props) as Record<string, unknown>)
      : {};
    return {
      ...resolved,
      value: wrapperValue !== undefined ? wrapperValue : resolved.value,
      onChange: (next: unknown) => {
        setWrapperValue(next);
        if (onPropChange && 'value' in state) onPropChange('value', next);
      },
    };
  }, [wrapper, wrapperValue, state, onPropChange]);

  const renderPreview = useCallback(
    (rendered: ReactNode): ReactNode => {
      if (!wrapper || !WrapperComponent) return rendered;
      const slotProp = wrapper.slotProp;
      if (slotProp) {
        return createElement(WrapperComponent, {
          ...wrapperProps,
          [slotProp]: rendered,
        });
      }
      return createElement(WrapperComponent, wrapperProps, rendered);
    },
    [wrapper, WrapperComponent, wrapperProps],
  );

  if (missingRequiredProps.length > 0) {
    return (
      <PreviewFrame name={`${name} playground`}>
        <Placeholder>
          <Text type="supporting" color="secondary">
            This preview needs required props that cannot be generated
            automatically.
          </Text>
          <Text type="supporting" color="secondary">
            Missing: {missingRequiredProps.join(', ')}
          </Text>
        </Placeholder>
      </PreviewFrame>
    );
  }

  if (!Previewed) {
    return (
      <PreviewFrame name={`${name} playground`}>
        <Placeholder>
          <Text type="supporting" color="secondary">
            No interactive preview for {name}: it is not a value
            <Text type="code"> @tecton/react </Text>
            exports from its root.
          </Text>
        </Placeholder>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame
      name={`${name} playground`}
      action={
        <Button
          label={showCode ? 'Show preview' : 'Show code'}
          icon={<Icon icon={CodeIcon} size="sm" />}
          variant={showCode ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowCode(value => !value)}
        />
      }
      isBare={showCode}
    >
      {showCode ? (
        <CodeBlock code={generateCode(name, state)} label={`<${name} />`} />
      ) : (
        <Center
          style={{minHeight: 200, width: '100%', padding: 'var(--spacing-4)'}}
        >
          <Suspense
            fallback={
              <Text type="supporting" color="secondary">
                Loading preview…
              </Text>
            }
          >
            <PreviewErrorBoundary
              resetKeys={[Previewed, runtimeState, WrapperComponent]}
            >
              {renderPreview(createElement(Previewed, runtimeState))}
              {isOverlayPreviewClosed(playground, state) && (
                <VStack
                  gap={2}
                  style={{
                    alignItems: 'center',
                    paddingBlock: 24,
                    paddingInline: 16,
                    textAlign: 'center',
                  }}
                >
                  <Text type="supporting" color="secondary">
                    Opens as an overlay — nothing renders while it is closed.
                  </Text>
                  {onPropChange != null &&
                    overlayControl != null &&
                    (overlayControl.stateProp !== 'isOpen' ||
                      canControlOpenState) && (
                      <Button
                        label="Open preview"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          onPropChange(
                            overlayControl.stateProp,
                            overlayControl.openValue,
                          )
                        }
                      />
                    )}
                </VStack>
              )}
            </PreviewErrorBoundary>
          </Suspense>
        </Center>
      )}
    </PreviewFrame>
  );
}
