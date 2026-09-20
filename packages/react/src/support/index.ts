/**
 * The helpers, hooks and data types the components need.
 *
 * A component is rarely enough on its own: a table's sorting lives in a hook, a
 * date input speaks in ISO strings, an autocomplete needs a source. This module
 * publishes those under Tecton names so a consumer never has to reach past
 * `@tecton/react` to make a Tecton component work. Everything here is
 * re-exported from the package root and from `@tecton/react/support`; nothing
 * here is a component, and components live in `src/components`.
 *
 * **Every line here is an alias, never a re-export**, and that is not a style
 * choice. `export {x} from '…'` puts the declaration file it names into the
 * public type graph, so an editor showing `AutocompleteSource` would show the
 * prose of the module Tecton is built on — the same leak
 * `scripts/check-consumer-surface.mjs` fails the build for. An `import` plus a
 * Tecton-named alias publishes the *shape* without publishing the module, and
 * is what every wrapper in `src/components` already does.
 */
import {
  createStaticSource as baseCreateStaticSource,
  type SearchSource,
  type SearchableItem,
  type CreateStaticSourceOptions,
} from '@astryxdesign/core/Typeahead';
import type {
  ISODateString,
  DateRange as BaseDateRange,
} from '@astryxdesign/core/Calendar';
import type {ISODateTimeString} from '@astryxdesign/core/DateTimeInput';
import type {ISOTimeString} from '@astryxdesign/core/TimeInput';
import type {DateRangePreset as BaseDateRangePreset} from '@astryxdesign/core/DateRangeInput';
import {
  useImperativeDialog as baseUseImperativeDialog,
  type DialogPurpose as BaseDialogPurpose,
  type ImperativeDialogReturn,
} from '@astryxdesign/core/Dialog';
import type {
  BottomSheetHeight as BaseBottomSheetHeight,
  BottomSheetSnapPoint as BaseBottomSheetSnapPoint,
} from '@astryxdesign/core/BottomSheet';
import {useHoverCard as baseUseHoverCard} from '@astryxdesign/core/HoverCard';
import {
  useLightbox as baseUseLightbox,
  type LightboxMedia as BaseLightboxMedia,
} from '@astryxdesign/core/Lightbox';
import {usePopover as baseUsePopover} from '@astryxdesign/core/Popover';
import {useTooltip as baseUseTooltip} from '@astryxdesign/core/Tooltip';
import {useLayer as baseUseLayer} from '@astryxdesign/core/Layer';
import type {MenuPresentation as BaseMenuPresentation} from '@astryxdesign/core/ContextMenu';
import {
  useResizable as baseUseResizable,
  percent as basePercent,
  type ResizableRegion as BaseResizableRegion,
} from '@astryxdesign/core/Resizable';
import {
  useMediaQuery as baseUseMediaQuery,
  useGridFocus as baseUseGridFocus,
  useContainerReveal as baseUseContainerReveal,
  useStreamingText as baseUseStreamingText,
} from '@astryxdesign/core/hooks';
import {useScrollableArea as baseUseScrollableArea} from '@astryxdesign/core/ScrollableArea';
import {useSideNavCollapse as baseUseSideNavCollapse} from '@astryxdesign/core/SideNav';
import {
  AppShellMobileContext as BaseAppShellMobileContext,
  useAppShellMobile as baseUseAppShellMobile,
} from '@astryxdesign/core/AppShell';
import type {OutlineItem} from '@astryxdesign/core/Outline';
import {
  useChatDictation as baseUseChatDictation,
  useSpeechRecognition as baseUseSpeechRecognition,
  type ChatComposerTrigger as BaseChatComposerTrigger,
  type ChatComposerInputHandle as BaseChatComposerInputHandle,
  type ChatToolCallItem as BaseChatToolCallItem,
  type UseSpeechRecognitionReturn as BaseUseSpeechRecognitionReturn,
} from '@astryxdesign/core/Chat';
import {
  createPowerSearchConfig as baseCreatePowerSearchConfig,
  usePowerSearchConfig as baseUsePowerSearchConfig,
  type PowerSearchConfig as BasePowerSearchConfig,
  type PowerSearchFilter as BasePowerSearchFilter,
  type PowerSearchField as BasePowerSearchField,
  type PowerSearchOperator as BasePowerSearchOperator,
} from '@astryxdesign/core/PowerSearch';
import type {TreeListItemData} from '@astryxdesign/core/TreeList';
import {useCollapsible as baseUseCollapsible} from '@astryxdesign/core/Collapsible';
import {
  defineSyntaxTheme as baseDefineSyntaxTheme,
  catppuccinLatte as baseCatppuccinLatte,
  catppuccinMocha as baseCatppuccinMocha,
  dracula as baseDracula,
  githubDark as baseGithubDark,
  githubLight as baseGithubLight,
  monokai as baseMonokai,
  nord as baseNord,
  oneDarkPro as baseOneDarkPro,
  oneLight as baseOneLight,
  solarizedLight as baseSolarizedLight,
  tokyoNight as baseTokyoNight,
  tokyoNightLight as baseTokyoNightLight,
  type SyntaxThemeDefinition,
} from '@astryxdesign/core/theme/syntax';
import {
  useTableColumnResize as baseUseTableColumnResize,
  useTableColumnSettings as baseUseTableColumnSettings,
  useTableColumnSettingsState as baseUseTableColumnSettingsState,
  useTableFilterState as baseUseTableFilterState,
  useTableFiltering as baseUseTableFiltering,
  useTableGroupedRows as baseUseTableGroupedRows,
  useTablePagination as baseUseTablePagination,
  useTableRowExpansion as baseUseTableRowExpansion,
  useTableRowIndex as baseUseTableRowIndex,
  useTableRowStatus as baseUseTableRowStatus,
  useTableSelection as baseUseTableSelection,
  useTableSelectionState as baseUseTableSelectionState,
  useTableSortable as baseUseTableSortable,
  useTableSortableState as baseUseTableSortableState,
  useTableStickyColumns as baseUseTableStickyColumns,
  useTableTreeData as baseUseTableTreeData,
  useTableTreeState as baseUseTableTreeState,
  toSearchFilters as baseToSearchFilters,
  paginateData as basePaginateData,
  type UseTableRowStatusConfig as BaseUseTableRowStatusConfig,
  type TableSortState as BaseTableSortState,
  type TableFilterState as BaseTableFilterState,
  type TableRowStatus as BaseTableRowStatus,
} from '@astryxdesign/core/Table';

/* Autocomplete ------------------------------------------------------------ */

/** One row an Autocomplete can search over and offer. */
export type AutocompleteSearchable<TAuxData = unknown> =
  SearchableItem<TAuxData>;
/** Where an Autocomplete gets its suggestions. */
export type AutocompleteSource<
  T extends AutocompleteSearchable = AutocompleteSearchable,
> = SearchSource<T>;
/** Options for {@link createAutocompleteSource}. */
export type CreateAutocompleteSourceOptions<
  T extends AutocompleteSearchable = AutocompleteSearchable,
> = CreateStaticSourceOptions<T>;
/** An Autocomplete source over a fixed array of rows. */
export const createAutocompleteSource = baseCreateStaticSource;

/* Dates ------------------------------------------------------------------- */

/** A calendar date, as `YYYY-MM-DD`. */
export type IsoDateString = ISODateString;
/** A date and a time, as an ISO 8601 string. */
export type IsoDateTimeString = ISODateTimeString;
/** A time of day, as `HH:mm` or `HH:mm:ss`. */
export type IsoTimeString = ISOTimeString;
/** A start date and an end date. */
export type DateRange = BaseDateRange;
/** A named range a DateRangeInput can offer as a shortcut. */
export type DateRangePreset = BaseDateRangePreset;

/* Dialogs and overlays ---------------------------------------------------- */

/** Opens a Dialog from an event handler rather than from state. */
export const useImperativeDialog = baseUseImperativeDialog;
/** What {@link useImperativeDialog} hands back. */
export type ImperativeDialog = ImperativeDialogReturn;
/** What a dialog is for, which sets how hard it is to dismiss. */
export type DialogPurpose = BaseDialogPurpose;
/** How tall a BottomSheet opens. */
export type BottomSheetHeight = BaseBottomSheetHeight;
/** A height a BottomSheet settles at when it is dragged. */
export type BottomSheetSnapPoint = BaseBottomSheetSnapPoint;
/** Drives a HoverCard from your own trigger. */
export const useHoverCard = baseUseHoverCard;
/** Drives a Lightbox from your own trigger. */
export const useLightbox = baseUseLightbox;
/** One image or video a Lightbox shows. */
export type LightboxMedia = BaseLightboxMedia;
/** Drives a Popover from your own trigger. */
export const usePopover = baseUsePopover;
/** Drives a Tooltip from your own trigger. */
export const useTooltip = baseUseTooltip;
/** Places content in the page's layer stack. */
export const useLayer = baseUseLayer;
/** How a context menu presents itself. */
export type MenuPresentation = BaseMenuPresentation;

/* Layout and interaction -------------------------------------------------- */

/** Drives a resizable region. */
export const useResizable = baseUseResizable;
/** A resizable size expressed as a percentage. */
export const percent = basePercent;
/** One region a resizable layout divides. */
export type ResizableRegion = BaseResizableRegion;
/** Matches a media query, re-rendering when the answer changes. */
export const useMediaQuery = baseUseMediaQuery;
/** Arrow-key movement across a two-dimensional grid of controls. */
export const useGridFocus = baseUseGridFocus;
/** Reveals content as its container scrolls it into view. */
export const useContainerReveal = baseUseContainerReveal;
/** Types text out a character at a time, for a streamed answer. */
export const useStreamingText = baseUseStreamingText;
/** The scroll state of a ScrollableArea. */
export const useScrollableArea = baseUseScrollableArea;

/* Navigation -------------------------------------------------------------- */

/** Whether a SideNav is collapsed, and how to collapse it. */
export const useSideNavCollapse = baseUseSideNavCollapse;
/** Whether an AppShell is in its mobile layout. */
export const useAppShellMobile = baseUseAppShellMobile;
/** The context an AppShell publishes its mobile state on. */
export const AppShellMobileContext = BaseAppShellMobileContext;
/** One heading in an Outline. */
export type OutlineEntry = OutlineItem;

/* Chat -------------------------------------------------------------------- */

/** Dictation for a chat composer. */
export const useChatDictation = baseUseChatDictation;
/** Speech recognition, where the browser offers it. */
export const useSpeechRecognition = baseUseSpeechRecognition;
/** What {@link useSpeechRecognition} hands back. */
export type UseSpeechRecognitionReturn = BaseUseSpeechRecognitionReturn;
/** A character that opens a menu inside a chat composer. */
export type ChatComposerTrigger = BaseChatComposerTrigger;
/** Imperative handle on a chat composer's input. */
export type ChatComposerInputHandle = BaseChatComposerInputHandle;
/** One tool call in a chat transcript. */
export type ChatToolCallItem = BaseChatToolCallItem;

/* Power search ------------------------------------------------------------ */

/** Builds the configuration a PowerSearch searches against. */
export const createPowerSearchConfig = baseCreatePowerSearchConfig;
/** Reads the PowerSearch configuration from context. */
export const usePowerSearchConfig = baseUsePowerSearchConfig;
/** The fields and operators a PowerSearch offers. */
export type PowerSearchConfig = BasePowerSearchConfig;
/** One filter a PowerSearch has applied. */
export type PowerSearchFilter = BasePowerSearchFilter;
/** One field a PowerSearch can filter on. */
export type PowerSearchField = BasePowerSearchField;
/** One operator a PowerSearch field supports. */
export type PowerSearchOperator = BasePowerSearchOperator;

/* Tree -------------------------------------------------------------------- */

/** One node of the data a composed tree renders. */
export type TreeViewNode = TreeListItemData;

/* Disclosure -------------------------------------------------------------- */

/** Drives an Accordion from your own trigger. */
export const useAccordion = baseUseCollapsible;

/* Code themes ------------------------------------------------------------- */

/** Builds a code-highlighting theme from a token map. */
export const defineCodeTheme = baseDefineSyntaxTheme;
/** A code-highlighting theme. */
export type CodeThemeDefinition = SyntaxThemeDefinition;

export const catppuccinLatte = baseCatppuccinLatte;
export const catppuccinMocha = baseCatppuccinMocha;
export const dracula = baseDracula;
export const githubDark = baseGithubDark;
export const githubLight = baseGithubLight;
export const monokai = baseMonokai;
export const nord = baseNord;
export const oneDarkPro = baseOneDarkPro;
export const oneLight = baseOneLight;
export const solarizedLight = baseSolarizedLight;
export const tokyoNight = baseTokyoNight;
export const tokyoNightLight = baseTokyoNightLight;

/* Tables ------------------------------------------------------------------ */

export const useTableColumnResize = baseUseTableColumnResize;
export const useTableColumnSettings = baseUseTableColumnSettings;
export const useTableColumnSettingsState = baseUseTableColumnSettingsState;
export const useTableFilterState = baseUseTableFilterState;
export const useTableFiltering = baseUseTableFiltering;
export const useTableGroupedRows = baseUseTableGroupedRows;
export const useTablePagination = baseUseTablePagination;
export const useTableRowExpansion = baseUseTableRowExpansion;
export const useTableRowIndex = baseUseTableRowIndex;
export const useTableRowStatus = baseUseTableRowStatus;
export const useTableSelection = baseUseTableSelection;
export const useTableSelectionState = baseUseTableSelectionState;
export const useTableSortable = baseUseTableSortable;
export const useTableSortableState = baseUseTableSortableState;
export const useTableStickyColumns = baseUseTableStickyColumns;
export const useTableTreeData = baseUseTableTreeData;
export const useTableTreeState = baseUseTableTreeState;
/** Turns a table's filter state into the filters a search takes. */
export const toTableSearchFilters = baseToSearchFilters;
/** Slices rows into pages. */
export const paginateRows = basePaginateData;

/** Configuration for {@link useTableRowStatus}. */
export type UseTableRowStatusConfig<T extends Record<string, unknown>> =
  BaseUseTableRowStatusConfig<T>;
/** Which column a table is sorted by, and which way. */
export type TableSortState<TSortKey extends string = string> =
  BaseTableSortState<TSortKey>;
/** The filters a table has applied. */
export type TableFilterState = BaseTableFilterState;
/** The status a row is in, which colours it. */
export type TableRowStatus = BaseTableRowStatus;
