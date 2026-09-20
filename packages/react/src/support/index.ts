/**
 * The helpers, hooks and data types the components need.
 *
 * A component is rarely enough on its own: a table's sorting lives in a hook, a
 * date input speaks in ISO strings, an autocomplete needs a source. This module
 * publishes those under Tecton names so a consumer never has to reach past
 * `@tecton/react` to make a Tecton component work.
 *
 * Everything here is re-exported from the package root and from
 * `@tecton/react/support`. Nothing here is a component; components live in
 * `src/components`.
 */

/* Autocomplete ------------------------------------------------------------ */

export {createStaticSource as createAutocompleteSource} from '@astryxdesign/core/Typeahead';
export type {
  SearchSource as AutocompleteSource,
  SearchableItem as AutocompleteSearchable,
  CreateStaticSourceOptions as CreateAutocompleteSourceOptions,
} from '@astryxdesign/core/Typeahead';

/* Dates ------------------------------------------------------------------- */

export type {
  ISODateString as IsoDateString,
  DateRange,
} from '@astryxdesign/core/Calendar';
export type {ISODateTimeString as IsoDateTimeString} from '@astryxdesign/core/DateTimeInput';
export type {ISOTimeString as IsoTimeString} from '@astryxdesign/core/TimeInput';
export type {DateRangePreset} from '@astryxdesign/core/DateRangeInput';

/* Dialogs and overlays ---------------------------------------------------- */

export {useImperativeDialog} from '@astryxdesign/core/Dialog';
export type {
  DialogPurpose,
  ImperativeDialogReturn,
} from '@astryxdesign/core/Dialog';
export type {
  BottomSheetHeight,
  BottomSheetSnapPoint,
} from '@astryxdesign/core/BottomSheet';
export {useHoverCard} from '@astryxdesign/core/HoverCard';
export {useLightbox} from '@astryxdesign/core/Lightbox';
export type {LightboxMedia} from '@astryxdesign/core/Lightbox';
export {usePopover} from '@astryxdesign/core/Popover';
export {useTooltip} from '@astryxdesign/core/Tooltip';
export {useLayer} from '@astryxdesign/core/Layer';
export type {MenuPresentation} from '@astryxdesign/core/ContextMenu';

/* Layout and interaction -------------------------------------------------- */

export {useResizable, percent} from '@astryxdesign/core/Resizable';
export type {ResizableRegion} from '@astryxdesign/core/Resizable';
export {
  useMediaQuery,
  useGridFocus,
  useContainerReveal,
  useStreamingText,
} from '@astryxdesign/core/hooks';
export {useScrollableArea} from '@astryxdesign/core/ScrollableArea';

/* Navigation -------------------------------------------------------------- */

export {useSideNavCollapse} from '@astryxdesign/core/SideNav';
export {
  AppShellMobileContext,
  useAppShellMobile,
} from '@astryxdesign/core/AppShell';
export type {OutlineItem as OutlineEntry} from '@astryxdesign/core/Outline';

/* Chat -------------------------------------------------------------------- */

export {useChatDictation, useSpeechRecognition} from '@astryxdesign/core/Chat';
export type {
  ChatComposerTrigger,
  ChatComposerInputHandle,
  ChatToolCallItem,
  UseSpeechRecognitionReturn,
} from '@astryxdesign/core/Chat';

/* Power search ------------------------------------------------------------ */

export {
  createPowerSearchConfig,
  usePowerSearchConfig,
} from '@astryxdesign/core/PowerSearch';
export type {
  PowerSearchConfig,
  PowerSearchFilter,
  PowerSearchField,
  PowerSearchOperator,
} from '@astryxdesign/core/PowerSearch';

/* Tree -------------------------------------------------------------------- */

export type {TreeListItemData as TreeViewNode} from '@astryxdesign/core/TreeList';

/* Disclosure -------------------------------------------------------------- */

export {useCollapsible as useAccordion} from '@astryxdesign/core/Collapsible';

/* Tables ------------------------------------------------------------------ */

export {
  useTableColumnResize,
  useTableColumnSettings,
  useTableColumnSettingsState,
  useTableFilterState,
  useTableFiltering,
  useTableGroupedRows,
  useTablePagination,
  useTableRowExpansion,
  useTableRowIndex,
  useTableRowStatus,
  useTableSelection,
  useTableSelectionState,
  useTableSortable,
  useTableSortableState,
  useTableStickyColumns,
  useTableTreeData,
  useTableTreeState,
  toSearchFilters as toTableSearchFilters,
  paginateData as paginateRows,
} from '@astryxdesign/core/Table';
export type {
  UseTableRowStatusConfig,
  TableSortState,
  TableFilterState,
  TableRowStatus,
} from '@astryxdesign/core/Table';
