/**
 * How an upstream example is translated into a Tecton one.
 *
 * Two tables, and everything else the port script does follows from them.
 *
 * `PROP_RULES` is per **Tecton** component and only exists for the components
 * Tecton has designed itself: a pass-through publishes the upstream props
 * unchanged, so there is nothing to translate. Each rule can
 *
 *   - `rename` a prop,
 *   - map a prop's `values` from the upstream vocabulary to Tecton's,
 *   - `drop` a prop Tecton deliberately does not have, or
 *   - `dropIfValue` a prop only for values Tecton does not draw.
 *
 * A dropped prop is recorded per example in
 * `docs/engineering/ported-examples.log`, never removed silently.
 *
 * `SUPPORT` names the helpers and types an example reaches for that are not
 * components — table column widths, a data source, a hook — and where Tecton
 * publishes them.
 */

/** Upstream names Tecton folds into a component rather than publishing. */
export const FOLDED = {
  // Tecton's Dialog takes `confirmation` instead of a separate component.
  AlertDialog: 'Dialog',
  // Tecton's CheckboxGroup takes its items as data.
  CheckboxListItem: 'Checkbox',
  // Tecton's RadioGroup takes its items as data.
  RadioListItem: 'Radio',
};

/**
 * Tecton draws two control heights where upstream draws three, so `lg`
 * collapses onto `md` everywhere a control is sized.
 */
const CONTROL_SIZE = {size: {lg: 'md', xs: 'sm'}};

/** Per-Tecton-component prop translation. */
export const PROP_RULES = {
  Text: {
    rename: {type: 'variant', justify: 'align', hasStrikethrough: 'isStruckThrough'},
    values: {
      variant: {
        body: 'medium',
        large: 'large',
        label: 'smallStrong',
        supporting: 'small',
        code: 'smallData',
        'display-1': 'display1',
        'display-2': 'display2',
        'display-3': 'display3',
      },
      weight: {normal: 'regular'},
    },
    dropIfValue: {
      variant: ['inherit'],
      as: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'strong', 'em', 'small'],
    },
    drop: ['size', 'hasTruncateTooltip', 'wordBreak', 'textWrap', 'hasCapsize', 'xstyle', 'className', 'style'],
  },
  Heading: {
    rename: {type: 'variant', justify: 'align', accessibilityLevel: 'outlineLevel'},
    values: {
      variant: {'display-1': 'display1', 'display-2': 'display2', 'display-3': 'display3'},
      weight: {normal: 'regular'},
    },
    drop: ['display', 'hasTruncateTooltip', 'wordBreak', 'textWrap', 'hasCapsize', 'hasStrikethrough', 'size', 'xstyle', 'className', 'style'],
  },
  Card: {
    drop: ['elevation', 'height', 'xstyle', 'className', 'style'],
    dropIfValue: {
      padding: ['0.5', '1.5'],
      variant: ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'],
    },
  },
  Stack: {
    values: {direction: {row: 'horizontal', column: 'vertical', 'row-reverse': 'horizontal', 'column-reverse': 'vertical'}},
    drop: ['hAlign', 'vAlign', 'paddingInline', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlock', 'paddingBlockStart', 'paddingBlockEnd', 'xstyle', 'className', 'style'],
    dropIfValue: {gap: ['0.5', '1.5'], padding: ['0.5', '1.5'], align: ['baseline'], justify: ['space-between', 'space-around', 'space-evenly']},
  },
  HStack: {
    drop: ['hAlign', 'vAlign', 'direction', 'paddingInline', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlock', 'paddingBlockStart', 'paddingBlockEnd', 'xstyle', 'className', 'style'],
    dropIfValue: {gap: ['0.5', '1.5'], padding: ['0.5', '1.5'], align: ['baseline'], justify: ['space-between', 'space-around', 'space-evenly']},
  },
  VStack: {
    drop: ['hAlign', 'vAlign', 'direction', 'paddingInline', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlock', 'paddingBlockStart', 'paddingBlockEnd', 'xstyle', 'className', 'style'],
    dropIfValue: {gap: ['0.5', '1.5'], padding: ['0.5', '1.5'], align: ['baseline'], justify: ['space-between', 'space-around', 'space-evenly']},
  },
  Select: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  Autocomplete: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  Tabs: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  ToggleButton: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  ToggleButtonGroup: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  Slider: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  Menu: {values: {...CONTROL_SIZE}, drop: ['xstyle', 'className', 'style']},
  Icon: {
    rename: {icon: 'name'},
    drop: ['color', 'xstyle', 'className', 'style'],
    values: {size: {xsm: '16', sm: '16', md: '20', lg: '24'}},
    numeric: ['size'],
  },
  Button: {
    values: {variant: {ghost: 'tertiary', 'text-only': 'textOnly'}, size: {lg: 'md'}},
    drop: ['elevation', 'name', 'value', 'form', 'isInterruptible', 'isIconOnly', 'width', 'clickAction', 'href', 'as', 'target', 'rel', 'endContent', 'xstyle', 'className', 'style'],
  },
  IconButton: {
    values: {variant: {ghost: 'tertiary', 'text-only': 'textOnly'}, size: {lg: 'md'}},
    drop: ['elevation', 'clickAction', 'href', 'as', 'target', 'rel', 'xstyle', 'className', 'style'],
  },
  Badge: {
    dropIfValue: {variant: ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']},
    drop: ['xstyle', 'className', 'style'],
  },
  Chip: {drop: ['xstyle', 'className', 'style'], values: {size: {xs: 'sm'}}},
  Avatar: {
    values: {
      size: {xs: '18', sm: '24', md: '32', lg: '40', xl: '40', '2xl': '40'},
      shape: {rounded: 'rounded', circle: 'circle', square: 'square'},
    },
    numeric: ['size'],
    drop: ['xstyle', 'className', 'style', 'status', 'statusVariant'],
  },
  AvatarGroup: {drop: ['xstyle', 'className', 'style']},
  Alert: {drop: ['xstyle', 'className', 'style']},
  Divider: {drop: ['xstyle', 'className', 'style']},
  Link: {drop: ['xstyle', 'className', 'style']},
  Grid: {drop: ['xstyle', 'className', 'style']},
  Progress: {drop: ['xstyle', 'className', 'style'], values: {...CONTROL_SIZE}},
  Switch: {drop: ['xstyle', 'className', 'style'], values: {...CONTROL_SIZE}},
  TextField: {drop: ['xstyle', 'className', 'style'], values: {...CONTROL_SIZE}},
  TextArea: {drop: ['xstyle', 'className', 'style'], values: {...CONTROL_SIZE}},
  Checkbox: {drop: ['xstyle', 'className', 'style'], values: {...CONTROL_SIZE}},
  Tooltip: {drop: ['xstyle', 'className', 'style']},
  List: {
    drop: ['xstyle', 'className', 'style'],
    values: {density: {compact: 'condensed', spacious: 'comfortable', balanced: 'default'}},
  },
  ListItem: {drop: ['xstyle', 'className', 'style']},
};

/**
 * Helpers and types that are not components.
 *
 * `null` means Tecton does not publish it, which makes any example that needs
 * it unportable — and says so in the log rather than dropping it quietly.
 */
export const SUPPORT = {
  // Table column widths are plain data in Tecton, so the two builders are
  // rewritten at the call site and never imported.
  proportional: {inline: true},
  pixel: {inline: true},
  TableColumn: {name: 'TableColumn', type: true, component: 'Table'},

  useToast: {name: 'useToast', component: 'Toast'},

  createStaticSource: {name: 'createAutocompleteSource'},
  SearchSource: {name: 'AutocompleteSource', type: true},
  SearchableItem: {name: 'AutocompleteSearchable', type: true},

  useImperativeDialog: {name: 'useImperativeDialog'},
  useImperativeAlertDialog: {name: 'useImperativeDialog'},

  ISODateString: {name: 'IsoDateString', type: true},
  ISODateTimeString: {name: 'IsoDateTimeString', type: true},
  ISOTimeString: {name: 'IsoTimeString', type: true},
  DateRange: {name: 'DateRange', type: true},

  TreeListItemData: {name: 'TreeViewNode', type: true},

  PowerSearchConfig: {name: 'PowerSearchConfig', type: true},
  PowerSearchFilter: {name: 'PowerSearchFilter', type: true},
  usePowerSearchConfig: {name: 'usePowerSearchConfig'},
  createPowerSearchConfig: {name: 'createPowerSearchConfig'},

  OutlineItem: {name: 'OutlineEntry', type: true},

  useCollapsible: {name: 'useAccordion'},
  useHoverCard: {name: 'useHoverCard'},
  useLightbox: {name: 'useLightbox'},
  usePopover: {name: 'usePopover'},
  useTooltip: {name: 'useTooltip'},
  useResizable: {name: 'useResizable'},
  useMediaQuery: {name: 'useMediaQuery'},
  useGridFocus: {name: 'useGridFocus'},
  useContainerReveal: {name: 'useContainerReveal'},
  useStreamingText: {name: 'useStreamingText'},
  useChatDictation: {name: 'useChatDictation'},
  useSpeechRecognition: {name: 'useSpeechRecognition'},
  UseSpeechRecognitionReturn: {name: 'UseSpeechRecognitionReturn', type: true},
  useAppShellMobile: {name: 'useAppShellMobile'},
  useSideNavCollapse: {name: 'useSideNavCollapse'},
  useLayer: {name: 'useLayer'},

  ResizeHandle: {name: 'ResizeHandle', component: 'ResizeHandle'},

  useTableColumnResize: {name: 'useTableColumnResize'},
  useTableColumnSettings: {name: 'useTableColumnSettings'},
  useTableColumnSettingsState: {name: 'useTableColumnSettingsState'},
  useTableFilterState: {name: 'useTableFilterState'},
  useTableFiltering: {name: 'useTableFiltering'},
  useTableGroupedRows: {name: 'useTableGroupedRows'},
  useTablePagination: {name: 'useTablePagination'},
  useTableRowExpansion: {name: 'useTableRowExpansion'},
  useTableRowIndex: {name: 'useTableRowIndex'},
  useTableRowStatus: {name: 'useTableRowStatus'},
  UseTableRowStatusConfig: {name: 'UseTableRowStatusConfig', type: true},
  useTableSelection: {name: 'useTableSelection'},
  useTableSelectionState: {name: 'useTableSelectionState'},
  useTableSortable: {name: 'useTableSortable'},
  useTableSortableState: {name: 'useTableSortableState'},
  useTableStickyColumns: {name: 'useTableStickyColumns'},
  useTableTreeData: {name: 'useTableTreeData'},
  useTableTreeState: {name: 'useTableTreeState'},
  toSearchFilters: {name: 'toTableSearchFilters'},
  paginateData: {name: 'paginateRows'},

  BottomSheetHeight: {name: 'BottomSheetHeight', type: true},
  BottomSheetSnapPoint: {name: 'BottomSheetSnapPoint', type: true},
  DialogPurpose: {name: 'DialogPurpose', type: true},
  ChatComposerTrigger: {name: 'ChatComposerTrigger', type: true},
  ChatComposerInputHandle: {name: 'ChatComposerInputHandle', type: true},
  ChatToolCallItem: {name: 'ChatToolCallItem', type: true},
  AppShellMobileContext: {name: 'AppShellMobileContext'},
  MenuPresentation: {name: 'MenuPresentation', type: true},
};
