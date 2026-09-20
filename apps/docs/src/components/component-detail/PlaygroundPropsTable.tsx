/**
 * The props table with a knob on every row it can draw one for.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/PlaygroundPropsTable.tsx`: required props
 * first, the type with its default beside it, the description as the Markdown
 * it was authored as, and — where the type is one a control can express — an
 * input that writes straight into the preview above.
 */

import {createElement, useState} from 'react';
import {HStack, VStack} from '@tecton/react/Layout';
import {Badge} from '@tecton/react/Badge';
import {Divider} from '@tecton/react/Divider';
import {Icon} from '@tecton/react/Icon';
import {IconButton} from '@tecton/react/IconButton';
import {NumberInput} from '@tecton/react/NumberInput';
import {Selector} from '@tecton/react/Selector';
import {Switch} from '@tecton/react/Switch';
import {TextInput} from '@tecton/react/TextInput';
import {Heading, Text} from '@tecton/react/Text';
import {AddIcon, RemoveIcon} from '@tecton/react/icons';
import {allSyntaxPresets} from '@tecton/react/theme/syntax';
import type {DocProp, ElementDescriptor} from '@/types/docs';
import {MarkdownText} from './MarkdownText';
import {coerceEnumOption, type PropControlDescriptor} from './parsePropType';
import {resolveElementDescriptor} from './resolveElements';
import type {KnobProp} from './interactiveState';

function formatType(type: string, defaultValue?: string) {
  const parts = type.split(/\s*\|\s*/);
  const isEnum =
    parts.length > 1 && parts.every(part => /^['"]/.test(part.trim()));
  if (isEnum) {
    return (
      <>
        {parts.map((part, index) => {
          const trimmed = part.trim();
          const isDefault = defaultValue != null && trimmed === defaultValue;
          return (
            <span key={index}>
              {'| '}
              {isDefault ? <b>{trimmed}</b> : trimmed}
              {isDefault && ' (default)'}
              {index < parts.length - 1 && <br />}
            </span>
          );
        })}
      </>
    );
  }
  if (defaultValue != null) {
    return (
      <>
        {type} <span style={{opacity: 0.6}}>(default: {defaultValue})</span>
      </>
    );
  }
  return type;
}

function resolveSlotElement(
  componentName: string,
  slotElements?: readonly ElementDescriptor[],
) {
  const match = slotElements?.find(
    element => element.__element === componentName,
  );
  if (match) return resolveElementDescriptor(match);
  switch (componentName) {
    case 'Icon':
      return createElement(Icon, {icon: 'check', size: 'sm'});
    case 'Badge':
      return createElement(Badge, {label: 'Badge'});
    default:
      return null;
  }
}

type InputStatusOption = 'error' | 'warning' | 'success';

const STATUS_LABELS: Record<InputStatusOption, string> = {
  error: 'Error',
  warning: 'Warning',
  success: 'Success',
};

function createStatusValue(type: InputStatusOption) {
  return {type, message: `${STATUS_LABELS[type]} status message`};
}

function getStatusValue(value: unknown): InputStatusOption | 'None' {
  if (
    value != null &&
    typeof value === 'object' &&
    'type' in value &&
    typeof (value as {type: unknown}).type === 'string' &&
    (value as {type: string}).type in STATUS_LABELS
  ) {
    return (value as {type: InputStatusOption}).type;
  }
  return 'None';
}

const syntaxThemeOptions = allSyntaxPresets.map(theme => ({
  value: theme.name,
  label: theme.name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
  theme,
}));

function ElementControl({
  control,
  value,
  onChange,
  prop,
}: {
  control: Extract<PropControlDescriptor, {kind: 'element'}>;
  value: unknown;
  onChange: (next: unknown) => void;
  prop: DocProp;
}) {
  const [selected, setSelected] = useState('None');

  if (control.options.length === 1) {
    const option = control.options[0];
    return (
      <Switch
        label={option.label}
        value={value != null}
        onChange={on =>
          onChange(
            on
              ? resolveSlotElement(option.componentName, prop.slotElements)
              : undefined,
          )
        }
      />
    );
  }

  return (
    <Selector
      label={prop.name}
      isLabelHidden
      placeholder="None"
      value={value != null ? selected : 'None'}
      options={['None', ...control.options.map(option => option.label)]}
      onChange={(next: string) => {
        setSelected(next);
        const option = control.options.find(entry => entry.label === next);
        onChange(
          next === 'None' || !option
            ? undefined
            : resolveSlotElement(option.componentName, prop.slotElements),
        );
      }}
    />
  );
}

function SlotListControl({
  control,
  value,
  onChange,
  prop,
}: {
  control: Extract<PropControlDescriptor, {kind: 'slot-list'}>;
  value: unknown;
  onChange: (next: unknown) => void;
  prop: DocProp;
}) {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    const slot = prop.slotElements?.[0];
    if (!slot) return;
    const index = items.length + 1;
    const props = {...(slot.props ?? {})};
    if (typeof props.label === 'string')
      props.label = `${props.label} ${index}`;
    if (typeof props.value === 'string')
      props.value = `${props.value}-${index}`;
    const children =
      typeof slot.children === 'string'
        ? `${slot.children} ${index}`
        : slot.children;
    onChange([...items, resolveElementDescriptor({...slot, props, children})]);
  };

  return (
    <HStack gap={2} vAlign="center">
      <Text type="supporting" color="secondary">
        {items.length} {control.options[0].label}
        {items.length === 1 ? '' : 's'}
      </Text>
      <HStack gap={1}>
        <IconButton
          label="Remove item"
          tooltip="Remove item"
          icon={<Icon icon={RemoveIcon} size="sm" />}
          variant="ghost"
          size="sm"
          isDisabled={items.length === 0}
          onClick={() => onChange(items.slice(0, -1))}
        />
        <IconButton
          label="Add item"
          tooltip="Add item"
          icon={<Icon icon={AddIcon} size="sm" />}
          variant="ghost"
          size="sm"
          onClick={addItem}
        />
      </HStack>
    </HStack>
  );
}

function InlineControl({
  control,
  value,
  onChange,
  prop,
}: {
  control: PropControlDescriptor;
  value: unknown;
  onChange: (next: unknown) => void;
  prop: DocProp;
}) {
  switch (control.kind) {
    case 'boolean':
      return (
        <Switch
          label={prop.name}
          isLabelHidden
          value={value === true}
          onChange={next => onChange(next)}
        />
      );
    case 'enum': {
      const isNumeric = control.options.every(option =>
        /^-?\d+(\.\d+)?$/.test(option),
      );
      const options = control.allowEmpty
        ? ['None', ...control.options]
        : control.options;
      const selected =
        value == null && control.allowEmpty
          ? 'None'
          : String(value ?? control.options[0]);
      return (
        <Selector
          label={prop.name}
          isLabelHidden
          value={selected}
          options={options}
          onChange={(next: string) => {
            if (control.allowEmpty && next === 'None') {
              onChange(undefined);
              return;
            }
            onChange(
              isNumeric ? Number(next) : coerceEnumOption(control, next),
            );
          }}
        />
      );
    }
    case 'input-status': {
      const options = control.allowEmpty
        ? ['None', ...control.options]
        : control.options;
      return (
        <Selector
          label={prop.name}
          isLabelHidden
          value={getStatusValue(value)}
          options={options}
          onChange={(next: string) =>
            onChange(
              next === 'None'
                ? undefined
                : createStatusValue(next as InputStatusOption),
            )
          }
        />
      );
    }
    case 'theme':
      // Tecton ships one theme, so there is nothing to choose between; the
      // preview already renders under it.
      return (
        <Text type="supporting" color="secondary">
          Tecton
        </Text>
      );
    case 'syntax-theme': {
      const selected =
        syntaxThemeOptions.find(
          option =>
            option.theme === value ||
            (value != null &&
              typeof value === 'object' &&
              'name' in value &&
              option.theme.name === (value as {name: string}).name),
        )?.value ?? syntaxThemeOptions[0].value;
      return (
        <Selector
          label={prop.name}
          isLabelHidden
          value={selected}
          options={syntaxThemeOptions.map(({value: optionValue, label}) => ({
            value: optionValue,
            label,
          }))}
          onChange={(next: string) => {
            const match = syntaxThemeOptions.find(
              option => option.value === next,
            );
            if (match) onChange(match.theme);
          }}
        />
      );
    }
    case 'string':
      return (
        <TextInput
          label={prop.name}
          isLabelHidden
          placeholder="value"
          value={typeof value === 'string' ? value : ''}
          onChange={next => onChange(next)}
        />
      );
    case 'number':
      return (
        <NumberInput
          label={prop.name}
          isLabelHidden
          value={typeof value === 'number' ? value : null}
          placeholder="unset"
          hasClear
          onChange={(next: number | null) => onChange(next ?? undefined)}
        />
      );
    case 'element':
      return (
        <ElementControl
          control={control}
          value={value}
          onChange={onChange}
          prop={prop}
        />
      );
    case 'slot-list':
      return (
        <SlotListControl
          control={control}
          value={value}
          onChange={onChange}
          prop={prop}
        />
      );
    default:
      return null;
  }
}

function PropRow({
  prop,
  knob,
  value,
  onChange,
}: {
  prop: DocProp;
  knob?: KnobProp;
  value?: unknown;
  onChange?: (next: unknown) => void;
}) {
  return (
    <div className="flex flex-col gap-3 py-2 md:flex-row md:items-start">
      <div className="md:w-48 md:shrink-0">
        <Text type="body" weight="bold">
          {prop.name}
        </Text>
      </div>
      <div className="min-w-0 flex-1">
        <Text type="code" display="block">
          {formatType(prop.type, prop.default)}
        </Text>
        {prop.description ? (
          <MarkdownText type="body" color="secondary">
            {prop.description}
          </MarkdownText>
        ) : null}
      </div>
      {knob && onChange ? (
        <div className="md:w-48 md:shrink-0">
          <InlineControl
            control={knob.control}
            value={value}
            onChange={onChange}
            prop={prop}
          />
        </div>
      ) : null}
    </div>
  );
}

export function PlaygroundPropsTable({
  props,
  knobs,
  state,
  onPropChange,
}: {
  props: readonly DocProp[];
  knobs: readonly KnobProp[];
  state: Record<string, unknown>;
  onPropChange: (name: string, value: unknown) => void;
}) {
  const knobMap = new Map(knobs.map(knob => [knob.row.name, knob]));
  const required = props.filter(prop => prop.required);
  const optional = props.filter(prop => !prop.required);

  const group = (heading: string, rows: readonly DocProp[]) =>
    rows.length === 0 ? null : (
      <VStack gap={0}>
        <Heading level={4} color="secondary">
          {heading}
        </Heading>
        {[...rows]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(prop => (
            <div key={prop.name}>
              <Divider />
              <PropRow
                prop={prop}
                knob={knobMap.get(prop.name)}
                value={state[prop.name]}
                onChange={next => onPropChange(prop.name, next)}
              />
            </div>
          ))}
      </VStack>
    );

  return (
    <VStack gap={4}>
      {group('Required', required)}
      {group('Optional', optional)}
    </VStack>
  );
}
