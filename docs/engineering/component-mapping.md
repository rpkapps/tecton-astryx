# Component mapping

What every Tecton component is built on, how its props are translated, and
where Tecton's design and the upstream model disagree.

Tecton is implemented on `@astryxdesign/core`. Nothing below is visible to a
consumer: `scripts/check-consumer-surface.mjs` fails the build if the upstream
name reaches an exported name, a published type or a doc comment in `dist/`.
This file is for the people maintaining the wrappers.

Three rules run through the whole table.

1. **Tecton names win in the API, Astryx's grain wins in the mechanism.** Where
   the two vocabularies disagree, the Tecton name is what a consumer writes and
   the wrapper translates it. Where Astryx's _model_ disagrees — a prop that
   does not exist, a state that is not addressable — Astryx wins and the gap is
   recorded, both here and in the component's `notes`.
2. **An icon prop takes a Tecton glyph name.** Every `icon`-shaped prop is a
   `TectonIconRef`: `'drill-bit'`, or an SVG component. Nothing a Tecton
   component needs is ever imported from Astryx.
3. **Data, not children, wherever a list is involved.** Menus, selects,
   checkbox groups, segmented controls and trees take arrays of plain objects,
   so a consumer never composes an Astryx child.

## The table

| Tecton              | Built on                                                                                                 | Prop mapping                                                                                                                                                                                                                             | Deviations                                                                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Accordion`         | `Collapsible`                                                                                            | `title`/`icon`/`secondaryText` composed into `trigger`; `isOpen`, `defaultIsOpen`, `onOpenChange`, `isDisabled`, `chevronPosition`, `value` pass through                                                                                 | No header action row: the trigger is one button and actions inside it would nest interactive elements. No `activated` state.                                                                                                |
| `AccordionGroup`    | `CollapsibleGroup`                                                                                       | `type`, `value`, `defaultValue`, `onChange`, `hasDividers`, `density`, `chevronPosition` pass through                                                                                                                                    | The group draws the dividers, so a rule sits under an open item too.                                                                                                                                                        |
| `Alert`             | `Banner`                                                                                                 | `status` (incl. the theme's custom `neutral`), `title`, `description`, `actions`→`endContent`, `placement` `inline\|page`→`container` `card\|section`; `collapsible={false}` is forced                                                   | No filled-vs-outlined emphasis. No disclosed body — `children` is not exposed.                                                                                                                                              |
| `Autocomplete`      | `Typeahead`                                                                                              | `options`/`onSearch` are wrapped into a `SearchSource`; `maxSuggestions`→`maxMenuItems`, `hasSuggestionsOnFocus`→`hasEntriesOnFocus`, `emptyText`→`emptySearchResultsText`; `statusVariant="detached"` forced                            | No tokenised multi-value mode (that is `Tokenizer`). Outlined appearance only.                                                                                                                                              |
| `Avatar`            | `Avatar`                                                                                                 | `size` `18\|24\|32\|40`→ the numeric scale, `shape`, `name`, `src`, `status`, `href`, `onClick` pass through                                                                                                                             | No accent colours, no `off` state. Tecton's 18px tier is drawn at 20px — the scale has no 18.                                                                                                                               |
| `AvatarGroup`       | `AvatarGroup` + `AvatarGroupOverflow`                                                                    | `max` slices the children and renders the overflow marker; `size`, `shape` pass through                                                                                                                                                  | `max` is Tecton's own — Astryx leaves slicing to the consumer. No overlap-spacing prop.                                                                                                                                     |
| `Badge`             | `Badge`                                                                                                  | `label`, `variant` (incl. the theme's custom `lime`), `icon`                                                                                                                                                                             | Tecton's _overlay_ badge (anchored, count capped at 99+) is a different component and is not built.                                                                                                                         |
| `Breadcrumbs`       | `Breadcrumbs`                                                                                            | `separator`, `variant`, `label` pass through                                                                                                                                                                                             | No overflow collapse; build it from a crumb whose label is an ellipsis.                                                                                                                                                     |
| `BreadcrumbItem`    | `BreadcrumbItem`                                                                                         | `icon`→`startIcon`; `href`, `isCurrent`, `onClick` pass through                                                                                                                                                                          | —                                                                                                                                                                                                                           |
| `Button`            | `Button`                                                                                                 | `variant` `primary\|secondary\|tertiary\|outlined\|textOnly`→`primary\|secondary\|ghost\|outlined\|text-only`; `size` `sm\|md`; `icon` resolved from a glyph name; `isFullWidth`→`width: '100%'`                                         | No `activated` state (that is `ToggleButton`). No destructive variant — the design has none. `outlined` and `text-only` are theme-added variants.                                                                           |
| `ButtonGroup`       | `ButtonGroup`                                                                                            | `label`, `orientation`, `size`, `isDisabled` pass through                                                                                                                                                                                | No group-level variant; emphasis is per button.                                                                                                                                                                             |
| `Card`              | `Card`                                                                                                   | `variant` `default\|muted\|transparent`, `padding`, `width`, `maxWidth`, `minHeight`                                                                                                                                                     | Elevation is not exposed: Tecton surfaces are flat.                                                                                                                                                                         |
| `Checkbox`          | `CheckboxInput`                                                                                          | `value` `boolean\|'indeterminate'`, `size` `sm\|md`, `name`→`htmlName`                                                                                                                                                                   | Indeterminate is not themeable — the box keeps the unchecked fill and only the mark changes.                                                                                                                                |
| `CheckboxGroup`     | `CheckboxList` + `CheckboxListItem`                                                                      | `items[]` → the list's children; `value`, `onChange`, `density`, `hasDividers`, `status` pass through                                                                                                                                    | —                                                                                                                                                                                                                           |
| `Chip`              | `Token`                                                                                                  | `color` `default\|primary\|info\|success\|warning\|error`→`default\|purple\|blue\|green\|orange\|red`; `size` `sm\|md\|lg`; `onRemove`, `onClick`, `isDisabled`                                                                          | No filled-vs-outlined emphasis.                                                                                                                                                                                             |
| `ColorSwatch`       | — (Tecton-owned, StyleX)                                                                                 | —                                                                                                                                                                                                                                        | No upstream equivalent. The lime selection ring is drawn outside the square.                                                                                                                                                |
| `Dialog`            | `Dialog` + `DialogHeader`, or `AlertDialog`                                                              | `size`→`variant`, `dismissal`→`purpose`, `hasCloseButton` wires the header's `onOpenChange`; `confirmation` switches to `AlertDialog`                                                                                                    | `children`/`footer` are ignored on a confirmation. Open and close stay on `isOpen`/`onOpenChange` so Phase 3 can coordinate them page-wide.                                                                                 |
| `Divider`           | `Divider`                                                                                                | `variant` `subtle\|strong` pass through; `medium` is a StyleX preset painted from `--color-border-emphasized`                                                                                                                            | Astryx has two weights, Tecton has three.                                                                                                                                                                                   |
| `Fab`               | `Button` (extended) / `IconButton` (round) with `elevation`                                              | `shape`, `variant`, `elevation`, `label`, `icon`                                                                                                                                                                                         | The pill radius is theme, not prop. No `activated` state.                                                                                                                                                                   |
| `Grid`              | `Grid`                                                                                                   | `columns`, `gap`, `rowGap`, `columnGap`, `align`, `justify`, sizing                                                                                                                                                                      | —                                                                                                                                                                                                                           |
| `Heading`           | `Heading`                                                                                                | `level`→`level`, `variant` `display1..3`→`type` `display-1..3`, `weight` `regular\|medium\|semibold\|bold`→`normal\|medium\|semibold\|bold`, `outlineLevel`→`accessibilityLevel`, `align`→`justify`                                      | Tecton names two heading sizes; levels 3–6 continue with the interface variants. `semibold`/`bold` resolve to the heaviest weights the theme carries (500 and 600).                                                         |
| `HStack` / `VStack` | `Stack`                                                                                                  | `direction` fixed                                                                                                                                                                                                                        | —                                                                                                                                                                                                                           |
| `Icon`              | — (Tecton-owned, StyleX over the generated glyphs)                                                       | `name`, `variant` `outline\|filled`, `size` `16\|20\|24`, `label`                                                                                                                                                                        | Does not wrap Astryx `Icon`: the artwork, the two cuts and the three literal sizes are Tecton's.                                                                                                                            |
| `IconButton`        | `IconButton`                                                                                             | Same variant and size mapping as `Button`                                                                                                                                                                                                | No `shape` prop (circular vs rounded square). No `activated` state.                                                                                                                                                         |
| `Link`              | `Link`                                                                                                   | `underline` `hover\|always`→`hasUnderline`, `isExternal`→`isExternalLink`, `weight`→`weight`                                                                                                                                             | Tecton links carry no colour; the theme sets the base ink to the body colour.                                                                                                                                               |
| `List`              | `List`                                                                                                   | `density` `condensed\|default\|comfortable`→`compact\|balanced\|spacious`, `marker`→`listStyle`, `hasDividers`, `header`, `start`                                                                                                        | No gutters prop.                                                                                                                                                                                                            |
| `ListItem`          | `ListItem`                                                                                               | `label`, `description`, `startContent`, `endContent`, `onClick`, `href`, `isSelected`, `isDisabled`                                                                                                                                      | The inventory suggested the generic `Item`; the list's own row component is used because it is what `List` renders and it carries the selected state.                                                                       |
| `Menu`              | `DropdownMenu`                                                                                           | `items[]` → `DropdownMenuOption[]` (`onSelect`→`onClick`, `shortcut`→`endContent`, `isDestructive`→`variant: 'destructive'`); trigger built from `label`, `variant`, `size`, `icon`, `isIconOnly`                                        | No menu density. No `selected` row.                                                                                                                                                                                         |
| `Panel`             | — (Tecton-owned, StyleX)                                                                                 | —                                                                                                                                                                                                                                        | No upstream equivalent. A rule and a darker surface, never a shadow.                                                                                                                                                        |
| `Progress`          | `ProgressBar` (linear), `Spinner` (circular indeterminate), Tecton-owned SVG ring (circular determinate) | `tone`→`variant`, `hasValueLabel`, `isIndeterminate`, `size` `16\|32`                                                                                                                                                                    | Determinate circular progress has no upstream equivalent. No buffer type, no teal/lime roles.                                                                                                                               |
| `Radio`             | `RadioListItem`                                                                                          | `label`, `value`, `description`, `startContent`, `endContent`, `isDisabled`                                                                                                                                                              | —                                                                                                                                                                                                                           |
| `RadioGroup`        | `RadioList`                                                                                              | `orientation`, `size` `sm\|md`, `status`, `name`→`htmlName`                                                                                                                                                                              | —                                                                                                                                                                                                                           |
| `Select`            | `Selector`                                                                                               | `options[]` → `SelectorOptionType[]` (`isDisabled`→`disabled`, `icon` resolved, `SelectSection.options` kept); `appearance` `outlined\|textOnly`→`variant` `input\|ghost`; `statusVariant="detached"` forced                             | No filled appearance. With `hasClear`, clearing reports `''` rather than `null`, so the callback keeps one signature.                                                                                                       |
| `Slider`            | `Slider`                                                                                                 | `value` picks the single or range prop shape; `marks`, `formatValue`, `valueDisplay`, `orientation`, `status`                                                                                                                            | No size prop. No colour roles.                                                                                                                                                                                              |
| `Stack`             | `Stack`                                                                                                  | `direction`, `gap`, `padding`, `justify`, `align`, `wrap`, sizing, `as`                                                                                                                                                                  | —                                                                                                                                                                                                                           |
| `Switch`            | `Switch`                                                                                                 | `size` `sm\|md`, `labelPosition`, `status`, `name`→`htmlName`                                                                                                                                                                            | Disabled-and-on cannot drop the violet — two states at once, one addressable.                                                                                                                                               |
| `Tab`               | `Tab`                                                                                                    | `icon`/`selectedIcon` resolved from glyph names; `panelId`, `href`, `endContent`, `isLabelHidden`                                                                                                                                        | Tab focus is the system ring, not the design's dark box.                                                                                                                                                                    |
| `Tabs`              | `TabList`                                                                                                | `pattern` `tabs\|navigation`→`role` `'tablist'\|undefined`; `size`, `layout`, `hasDivider`, `isFullBleed`                                                                                                                                | No filled tab style (that is closer to `SegmentedControl`). No vertical orientation.                                                                                                                                        |
| `Table`             | `Table`                                                                                                  | `columns[]`→`TableColumn[]` with `width` `number\|{share,minWidth}`→`pixel()`/`proportional()`; `density` `md\|sm`→`balanced\|compact`                                                                                                   | No built-in selection column, sort affordance or pagination. No small-screen layout.                                                                                                                                        |
| `Text`              | `Text`                                                                                                   | `variant`→`type`: `display1..3`→`display-1..3`, `large`→`large`, `medium`→`body`, `small`→`supporting`, and the other eight to the theme's custom text types; `weight`→`weight`, `align`→`justify`, `isStruckThrough`→`hasStrikethrough` | The eight custom types get CSS from the theme compiler but not their TypeScript augmentation, so the package declares `CustomTextTypes` itself in `src/theme/augmentations.d.ts`. `semibold`/`bold` resolve to 500 and 600. |
| `TextArea`          | `TextArea`                                                                                               | `name`→`htmlName`, `startIcon` resolved; `statusVariant="detached"` forced                                                                                                                                                               | Outlined appearance only.                                                                                                                                                                                                   |
| `TextField`         | `TextInput`                                                                                              | `size` `sm\|md`, `name`→`htmlName`, `startIcon` resolved; `statusVariant="detached"` forced                                                                                                                                              | Outlined only: no filled or text-only appearance, no dotted disabled rule, no solid-red filled error, no `enabled + active` interior.                                                                                       |
| `useToast`          | `useToast`                                                                                               | `ToastPayload` → `ToastOptions`: `title`+`body` composed into `body`, `durationMs`→`autoHideDuration`, `action`→`endContent` as a text-only button                                                                                       | The payload is data only, so Phase 3 can route it anywhere. Only `info` and `error`.                                                                                                                                        |
| `ToggleButton`      | `ToggleButton`                                                                                           | `size` `extraSmall\|small\|medium\|large`→`sm\|sm\|md\|lg`; `icon`/`pressedIcon` resolved                                                                                                                                                | Four Tecton sizes onto three. No variant prop.                                                                                                                                                                              |
| `ToggleButtonGroup` | `SegmentedControl` + `SegmentedControlItem`                                                              | `items[]` → the control's children; same size mapping as `ToggleButton`                                                                                                                                                                  | No vertical orientation. No emphasis prop.                                                                                                                                                                                  |
| `Tooltip`           | `Tooltip`                                                                                                | `delayMs`→`delay`, `placement`, `alignment`, `isEnabled`                                                                                                                                                                                 | Prefer the `tooltip` prop on buttons and fields: a disabled control swallows the hover events this component needs.                                                                                                         |
| `TreeView`          | `TreeList`                                                                                               | `items[]` nested, `items`→`children` per node; `density` `condensed\|default\|comfortable`→`compact\|balanced\|spacious`, `hasGuides`→`variant` `lineGuides\|noGuides`                                                                   | Tecton's design describes a flat list with an explicit depth; the nested shape is Astryx's and Tecton follows it. No colour tag, no trailing adornments, no hidden/disabled/right-click row states.                         |

## Icons

`packages/react/scripts/generate-icons.mjs` reads `design/icons/tecton/*.ts` —
the delivery, evaluated rather than pattern-matched — and writes
`src/icons/generated/*.tsx`, `src/icons/names.ts`, `src/icons/registry.ts` and
`src/theme/icons.ts`. `--check` runs in the package build and in `pnpm check`.

Two Figma artefacts are stripped on the way: the clip wrappers whose clip is the
whole 16×16 view box, and — on `strata`, the one `colored: true` glyph — a
`<foreignObject>` holding an HTML `conic-gradient`, which no SVG renderer
paints. Strata's top face is re-drawn with an SVG `<linearGradient>` across the
same three stops (`#9957BE` → `#C8102E` → `#F68F1F`), its id derived per
instance from `useId` so two strata on one page do not share a paint server.
Every other glyph, and the rest of strata, paints in `currentColor`.

### The semantic registry

The theme answers these Astryx semantic icon names with a Tecton glyph:

| Semantic name  | Tecton glyph    |     | Semantic name    | Tecton glyph     |
| -------------- | --------------- | --- | ---------------- | ---------------- |
| `close`        | `close`         |     | `arrowUp`        | `arrow-up`       |
| `check`        | `check`         |     | `arrowDown`      | `arrow-down`     |
| `chevronDown`  | `chevron-down`  |     | `arrowsUpDown`   | `caret-up-down`  |
| `chevronLeft`  | `chevron-left`  |     | `funnel`         | `filter`         |
| `chevronRight` | `chevron-right` |     | `eyeSlash`       | `visibility-off` |
| `success`      | `check-circle`  |     | `externalLink`   | `open-in-new`    |
| `error`        | `error`         |     | `viewColumns`    | `view-column`    |
| `warning`      | `warning`       |     | `wrench`         | `settings`       |
| `info`         | `info`          |     | `microphone`     | `microphone`     |
| `search`       | `search`        |     | `menu`           | `menu`           |
| `copy`         | `copy`          |     | `moreHorizontal` | `more-vert`      |

Two of those are judgement calls worth knowing about:

- **`moreHorizontal` → `more-vert`.** Tecton's overflow glyph is the vertical
  kebab; there is no horizontal one in the set. The semantic role wins over the
  literal name, so overflow menus draw Tecton's kebab.
- **`wrench` → `settings`.** Astryx's `wrench` means "settings, configuration",
  which is Tecton's gear.

These six semantic names have no Tecton glyph and keep the Astryx default:
`chevronsLeft`, `chevronsRight`, `calendar`, `clock`, `checkDouble`, `stop`.

## The whole surface

Tecton publishes a component for every component the library underneath it
publishes — 180 Tecton components over 164 upstream ones, because several
upstream exports are split (a family's subcomponents each get their own
directory) and a few Tecton components have no upstream counterpart at all
(`Panel`, `Icon`, `ColorSwatch`, `Fab`).

Two kinds of component live in that list, and the difference is the whole
design:

- **Designed** (48). Tecton names the props, narrows the choices, takes data
  where upstream took children, and writes the documentation. These are the
  components in the table above. They are hand-written and stay hand-written.
- **Generated** (132). Tecton has no opinion about these _yet_. They are
  published under Tecton names, with Tecton-named types and Tecton glyphs
  accepted on their icon props, and nothing else changed — so a consumer can
  reach for a `Calendar` or a `CommandPalette` today and get the designed
  version later without changing the import. `packages/react/wrappers.manifest.json`
  is the source of truth and `packages/react/scripts/generate-wrappers.mjs`
  emits the wrapper, its documentation, a smoke test and the export surface
  from it. `--check` runs in the package build and in `pnpm check`, so an
  upstream upgrade that moves a prop fails the build with a diff.

Promoting a generated component to a designed one is a manifest edit
(`handwritten: true`) plus the wrapper: the generator then leaves it alone.

Five names had to bend around the designed surface, because the designed names
win and the two would otherwise collide in the barrel:

| Upstream               | Tecton                     | Why                                                          |
| ---------------------- | -------------------------- | ------------------------------------------------------------ |
| `DropdownMenuItem`     | `MenuActionItem`           | `MenuItem` is already Menu's data shape for an entry.        |
| `DropdownMenuDivider`  | `MenuSeparator`            | `MenuDivider` is already Menu's data shape for a rule.       |
| `SelectorOption`       | `SelectChoice`             | `SelectOption` and `SelectItem` are already Select's data.   |
| `SegmentedControlItem` | `ToggleButtonGroupSegment` | `ToggleButtonGroupItem` is already the group's data shape.   |
| `FieldStatus`          | `FieldMessage`             | `FieldStatus` is already Tecton's shared field-status type.  |
| `Item`                 | `ItemRow`                  | `ListItem` is Tecton's list row; this is the bare primitive. |
| `ToggleButtonGroup`    | `ToggleButtonBar`          | Tecton's `ToggleButtonGroup` is the segmented control.       |

Three upstream exports are folded rather than published: `AlertDialog` is
Tecton's `Dialog` with a `confirmation`, and `CheckboxListItem` and
`RadioListItem` are data on `CheckboxGroup` and `RadioGroup`. `Theme` and
`Layer` are `TectonProvider`.

<!-- generated:surface-table -->

180 Tecton components. "Designed" means hand-written; "generated"
means emitted from the manifest and published with its behaviour unchanged.

| Tecton                       | Built on                                    | Kind      | Category   | Examples |
| ---------------------------- | ------------------------------------------- | --------- | ---------- | -------- |
| `Accordion`                  | `Collapsible` (`Collapsible`)               | designed  | Surfaces   | 8        |
| `AccordionGroup`             | `CollapsibleGroup` (`Collapsible`)          | designed  | Surfaces   | 2        |
| `Alert`                      | `Banner` (`Banner`)                         | designed  | Feedback   | 7        |
| `AppShell`                   | `AppShell` (`AppShell`)                     | generated | Layout     | 6        |
| `AspectRatio`                | `AspectRatio` (`AspectRatio`)               | generated | Layout     | 6        |
| `Autocomplete`               | `Typeahead` (`Typeahead`)                   | designed  | Forms      | 6        |
| `AutocompleteBase`           | `BaseTypeahead` (`Typeahead`)               | generated | Forms      | 0        |
| `AutocompleteItem`           | `TypeaheadItem` (`Typeahead`)               | generated | Forms      | 0        |
| `Avatar`                     | `Avatar` (`Avatar`)                         | designed  | Content    | 10       |
| `AvatarGroup`                | `AvatarGroup` (`AvatarGroup`)               | designed  | Content    | 1        |
| `AvatarGroupOverflow`        | `AvatarGroupOverflow` (`AvatarGroup`)       | generated | Content    | 0        |
| `AvatarStatusDot`            | `AvatarStatusDot` (`Avatar`)                | generated | Content    | 2        |
| `Badge`                      | `Badge` (`Badge`)                           | designed  | Content    | 6        |
| `Blockquote`                 | `Blockquote` (`Blockquote`)                 | generated | Content    | 3        |
| `BottomSheet`                | `BottomSheet` (`BottomSheet`)               | generated | Overlay    | 4        |
| `BottomSheetSwitcher`        | `BottomSheetSwitcher` (`BottomSheet`)       | generated | Overlay    | 2        |
| `BreadcrumbItem`             | `BreadcrumbItem` (`Breadcrumbs`)            | designed  | Navigation | 2        |
| `Breadcrumbs`                | `Breadcrumbs` (`Breadcrumbs`)               | designed  | Navigation | 5        |
| `Button`                     | `Button` (`Button`)                         | designed  | Action     | 5        |
| `ButtonGroup`                | `ButtonGroup` (`ButtonGroup`)               | designed  | Action     | 3        |
| `Calendar`                   | `Calendar` (`Calendar`)                     | generated | Forms      | 5        |
| `Card`                       | `Card` (`Card`)                             | designed  | Surfaces   | 6        |
| `Carousel`                   | `Carousel` (`Carousel`)                     | generated | Surfaces   | 3        |
| `Center`                     | `Center` (`Center`)                         | generated | Layout     | 3        |
| `ChatComposer`               | `ChatComposer` (`Chat`)                     | generated | Chat       | 5        |
| `ChatComposerDrawer`         | `ChatComposerDrawer` (`Chat`)               | generated | Chat       | 4        |
| `ChatComposerInput`          | `ChatComposerInput` (`Chat`)                | generated | Chat       | 6        |
| `ChatComposerTokenElement`   | `ChatComposerTokenElement` (`Chat`)         | generated | Chat       | 0        |
| `ChatDictationButton`        | `ChatDictationButton` (`Chat`)              | generated | Chat       | 5        |
| `ChatLayout`                 | `ChatLayout` (`Chat`)                       | generated | Chat       | 2        |
| `ChatLayoutScrollButton`     | `ChatLayoutScrollButton` (`Chat`)           | generated | Chat       | 2        |
| `ChatMessage`                | `ChatMessage` (`Chat`)                      | generated | Chat       | 4        |
| `ChatMessageBubble`          | `ChatMessageBubble` (`Chat`)                | generated | Chat       | 6        |
| `ChatMessageList`            | `ChatMessageList` (`Chat`)                  | generated | Chat       | 2        |
| `ChatMessageMetadata`        | `ChatMessageMetadata` (`Chat`)              | generated | Chat       | 4        |
| `ChatSendButton`             | `ChatSendButton` (`Chat`)                   | generated | Chat       | 4        |
| `ChatSystemMessage`          | `ChatSystemMessage` (`Chat`)                | generated | Chat       | 4        |
| `ChatTokenizedText`          | `ChatTokenizedText` (`Chat`)                | generated | Chat       | 3        |
| `ChatToolCalls`              | `ChatToolCalls` (`Chat`)                    | generated | Chat       | 4        |
| `Checkbox`                   | `CheckboxInput` (`CheckboxInput`)           | designed  | Forms      | 3        |
| `CheckboxGroup`              | `CheckboxList` (`CheckboxList`)             | designed  | Forms      | 1        |
| `Chip`                       | `Token` (`Token`)                           | designed  | Content    | 6        |
| `Citation`                   | `Citation` (`Citation`)                     | generated | Content    | 3        |
| `ClickableCard`              | `ClickableCard` (`ClickableCard`)           | generated | Surfaces   | 3        |
| `Code`                       | `Code` (`Code`)                             | generated | Content    | 4        |
| `CodeBlock`                  | `CodeBlock` (`CodeBlock`)                   | generated | Content    | 6        |
| `CodeTheme`                  | `SyntaxTheme` (`theme`)                     | generated | Providers  | 3        |
| `ColorSwatch`                | — (Tecton only)                             | designed  | Content    | 1        |
| `CommandPalette`             | `CommandPalette` (`CommandPalette`)         | generated | Overlay    | 5        |
| `CommandPaletteEmpty`        | `CommandPaletteEmpty` (`CommandPalette`)    | generated | Overlay    | 2        |
| `CommandPaletteFooter`       | `CommandPaletteFooter` (`CommandPalette`)   | generated | Overlay    | 2        |
| `CommandPaletteGroup`        | `CommandPaletteGroup` (`CommandPalette`)    | generated | Overlay    | 2        |
| `CommandPaletteInput`        | `CommandPaletteInput` (`CommandPalette`)    | generated | Overlay    | 2        |
| `CommandPaletteItem`         | `CommandPaletteItem` (`CommandPalette`)     | generated | Overlay    | 1        |
| `CommandPaletteList`         | `CommandPaletteList` (`CommandPalette`)     | generated | Overlay    | 2        |
| `ComplexSelector`            | `ComplexSelector` (`ComplexSelector`)       | generated | Forms      | 0        |
| `ContextMenu`                | `ContextMenu` (`ContextMenu`)               | generated | Action     | 3        |
| `ContextMenuCheckboxItem`    | `ContextMenuCheckboxItem` (`ContextMenu`)   | generated | Overlay    | 0        |
| `ContextMenuItem`            | `ContextMenuItem` (`ContextMenu`)           | generated | Action     | 2        |
| `ContextMenuRadioGroup`      | `ContextMenuRadioGroup` (`ContextMenu`)     | generated | Overlay    | 0        |
| `ContextMenuRadioItem`       | `ContextMenuRadioItem` (`ContextMenu`)      | generated | Overlay    | 0        |
| `ContextMenuSeparator`       | `ContextMenuDivider` (`ContextMenu`)        | generated | Overlay    | 0        |
| `ContextMenuSubMenu`         | `ContextMenuSubMenu` (`ContextMenu`)        | generated | Overlay    | 0        |
| `DateInput`                  | `DateInput` (`DateInput`)                   | generated | Forms      | 6        |
| `DateRangeInput`             | `DateRangeInput` (`DateRangeInput`)         | generated | Forms      | 3        |
| `DateTimeInput`              | `DateTimeInput` (`DateTimeInput`)           | generated | Forms      | 2        |
| `Dialog`                     | `Dialog` (`Dialog`)                         | designed  | Overlay    | 3        |
| `DialogHeader`               | `DialogHeader` (`Dialog`)                   | generated | Overlay    | 0        |
| `Divider`                    | `Divider` (`Divider`)                       | designed  | Layout     | 5        |
| `EmptyState`                 | `EmptyState` (`EmptyState`)                 | generated | Content    | 4        |
| `Fab`                        | `Button` (`Button`)                         | designed  | Action     | 1        |
| `Field`                      | `Field` (`Field`)                           | generated | Forms      | 4        |
| `FieldLabel`                 | `FieldLabel` (`Field`)                      | generated | Forms      | 2        |
| `FieldMessage`               | `FieldStatus` (`FieldStatus`)               | generated | Forms      | 2        |
| `FileInput`                  | `FileInput` (`FileInput`)                   | generated | Forms      | 2        |
| `FormLayout`                 | `FormLayout` (`FormLayout`)                 | generated | Layout     | 4        |
| `Grid`                       | `Grid` (`Grid`)                             | designed  | Layout     | 6        |
| `GridSpan`                   | `GridSpan` (`Grid`)                         | generated | Layout     | 2        |
| `Heading`                    | `Heading` (`Text`)                          | designed  | Typography | 6        |
| `HoverCard`                  | `HoverCard` (`HoverCard`)                   | generated | Overlay    | 2        |
| `HStack`                     | `HStack` (`HStack`)                         | designed  | Layout     | 2        |
| `Icon`                       | — (Tecton only)                             | designed  | Content    | 5        |
| `IconButton`                 | `IconButton` (`IconButton`)                 | designed  | Action     | 5        |
| `InputGroup`                 | `InputGroup` (`InputGroup`)                 | generated | Forms      | 2        |
| `InputGroupText`             | `InputGroupText` (`InputGroup`)             | generated | Forms      | 0        |
| `ItemRow`                    | `Item` (`Item`)                             | generated | Data       | 4        |
| `Kbd`                        | `Kbd` (`Kbd`)                               | generated | Content    | 4        |
| `Layout`                     | `Layout` (`Layout`)                         | generated | Layout     | 7        |
| `LayoutContent`              | `LayoutContent` (`Layout`)                  | generated | Layout     | 2        |
| `LayoutFooter`               | `LayoutFooter` (`Layout`)                   | generated | Layout     | 2        |
| `LayoutHeader`               | `LayoutHeader` (`Layout`)                   | generated | Layout     | 2        |
| `LayoutPanel`                | `LayoutPanel` (`Layout`)                    | generated | Layout     | 2        |
| `Lightbox`                   | `Lightbox` (`Lightbox`)                     | generated | Overlay    | 4        |
| `Link`                       | `Link` (`Link`)                             | designed  | Navigation | 5        |
| `LinkProvider`               | `LinkProvider` (`Link`)                     | generated | Providers  | 1        |
| `List`                       | `List` (`List`)                             | designed  | Data       | 6        |
| `ListItem`                   | `ListItem` (`List`)                         | designed  | Data       | 5        |
| `LocaleProvider`             | `InternationalizationProvider` (`i18n`)     | generated | Providers  | 0        |
| `Markdown`                   | `Markdown` (`Markdown`)                     | generated | Content    | 5        |
| `Menu`                       | `DropdownMenu` (`DropdownMenu`)             | designed  | Action     | 1        |
| `MenuActionItem`             | `DropdownMenuItem` (`DropdownMenu`)         | generated | Action     | 0        |
| `MenuCheckboxItem`           | `DropdownMenuCheckboxItem` (`DropdownMenu`) | generated | Action     | 0        |
| `MenuRadioGroup`             | `DropdownMenuRadioGroup` (`DropdownMenu`)   | generated | Action     | 0        |
| `MenuRadioItem`              | `DropdownMenuRadioItem` (`DropdownMenu`)    | generated | Action     | 0        |
| `MenuSeparator`              | `DropdownMenuDivider` (`DropdownMenu`)      | generated | Action     | 0        |
| `MenuSubMenu`                | `DropdownMenuSubMenu` (`DropdownMenu`)      | generated | Action     | 0        |
| `MetadataList`               | `MetadataList` (`MetadataList`)             | generated | Data       | 5        |
| `MetadataListItem`           | `MetadataListItem` (`MetadataList`)         | generated | Data       | 2        |
| `MobileNav`                  | `MobileNav` (`MobileNav`)                   | generated | Navigation | 4        |
| `MobileNavToggle`            | `MobileNavToggle` (`MobileNav`)             | generated | Navigation | 2        |
| `MoreMenu`                   | `MoreMenu` (`MoreMenu`)                     | generated | Action     | 5        |
| `MultiSelector`              | `MultiSelector` (`MultiSelector`)           | generated | Forms      | 7        |
| `NavHeadingMenu`             | `NavHeadingMenu` (`NavMenu`)                | generated | Navigation | 1        |
| `NavHeadingMenuItem`         | `NavHeadingMenuItem` (`NavMenu`)            | generated | Navigation | 0        |
| `NavIcon`                    | `NavIcon` (`NavIcon`)                       | generated | Navigation | 2        |
| `NumberInput`                | `NumberInput` (`NumberInput`)               | generated | Forms      | 5        |
| `Outline`                    | `Outline` (`Outline`)                       | generated | Navigation | 4        |
| `OverflowList`               | `OverflowList` (`OverflowList`)             | generated | Data       | 4        |
| `Overlay`                    | `Overlay` (`Overlay`)                       | generated | Overlay    | 3        |
| `Pagination`                 | `Pagination` (`Pagination`)                 | generated | Navigation | 4        |
| `Panel`                      | — (Tecton only)                             | designed  | Surfaces   | 2        |
| `Popover`                    | `Popover` (`Popover`)                       | generated | Overlay    | 5        |
| `PowerSearch`                | `PowerSearch` (`PowerSearch`)               | generated | Forms      | 5        |
| `Progress`                   | `ProgressBar` (`ProgressBar`)               | designed  | Feedback   | 5        |
| `Radio`                      | `RadioListItem` (`RadioList`)               | designed  | Forms      | 2        |
| `RadioGroup`                 | `RadioList` (`RadioList`)                   | designed  | Forms      | 6        |
| `ResizeHandle`               | `ResizeHandle` (`Resizable`)                | generated | Layout     | 1        |
| `ScrollableArea`             | `ScrollableArea` (`ScrollableArea`)         | generated | Layout     | 0        |
| `Section`                    | `Section` (`Section`)                       | generated | Layout     | 3        |
| `Select`                     | `Selector` (`Selector`)                     | designed  | Forms      | 5        |
| `SelectableCard`             | `SelectableCard` (`SelectableCard`)         | generated | Surfaces   | 3        |
| `SelectChoice`               | `SelectorOption` (`Selector`)               | generated | Forms      | 2        |
| `SideNav`                    | `SideNav` (`SideNav`)                       | generated | Navigation | 4        |
| `SideNavCollapseButton`      | `SideNavCollapseButton` (`SideNav`)         | generated | Navigation | 2        |
| `SideNavHeading`             | `SideNavHeading` (`SideNav`)                | generated | Navigation | 2        |
| `SideNavItem`                | `SideNavItem` (`SideNav`)                   | generated | Navigation | 2        |
| `SideNavSection`             | `SideNavSection` (`SideNav`)                | generated | Navigation | 2        |
| `Skeleton`                   | `Skeleton` (`Skeleton`)                     | generated | Feedback   | 4        |
| `Slider`                     | `Slider` (`Slider`)                         | designed  | Forms      | 2        |
| `Stack`                      | `Stack` (`Stack`)                           | designed  | Layout     | 4        |
| `StackItem`                  | `StackItem` (`Layout`)                      | generated | Layout     | 2        |
| `StatusDot`                  | `StatusDot` (`StatusDot`)                   | generated | Feedback   | 4        |
| `Step`                       | `Step` (`Stepper`)                          | generated | Navigation | 3        |
| `Stepper`                    | `Stepper` (`Stepper`)                       | generated | Navigation | 7        |
| `SurfaceTheme`               | `MediaTheme` (`theme`)                      | generated | Providers  | 3        |
| `Switch`                     | `Switch` (`Switch`)                         | designed  | Forms      | 6        |
| `Tab`                        | `Tab` (`TabList`)                           | designed  | Navigation | 2        |
| `Table`                      | `Table` (`Table`)                           | designed  | Data       | 5        |
| `TableBody`                  | `TableBody` (`Table`)                       | generated | Data       | 0        |
| `TableCell`                  | `TableCell` (`Table`)                       | generated | Data       | 0        |
| `TableFooter`                | `TableFooter` (`Table`)                     | generated | Data       | 0        |
| `TableHeader`                | `TableHeader` (`Table`)                     | generated | Data       | 0        |
| `TableHeaderCell`            | `TableHeaderCell` (`Table`)                 | generated | Data       | 0        |
| `TableRow`                   | `TableRow` (`Table`)                        | generated | Data       | 0        |
| `TabMenu`                    | `TabMenu` (`TabList`)                       | generated | Navigation | 2        |
| `Tabs`                       | `TabList` (`TabList`)                       | designed  | Navigation | 6        |
| `Text`                       | `Text` (`Text`)                             | designed  | Typography | 9        |
| `TextArea`                   | `TextArea` (`TextArea`)                     | designed  | Forms      | 6        |
| `TextField`                  | `TextInput` (`TextInput`)                   | designed  | Forms      | 9        |
| `Thumbnail`                  | `Thumbnail` (`Thumbnail`)                   | generated | Content    | 5        |
| `TimeInput`                  | `TimeInput` (`TimeInput`)                   | generated | Forms      | 5        |
| `Timestamp`                  | `Timestamp` (`Timestamp`)                   | generated | Content    | 5        |
| `Toast`                      | `useToast` (`Toast`)                        | designed  | Feedback   | 1        |
| `ToggleButton`               | `ToggleButton` (`ToggleButton`)             | designed  | Action     | 4        |
| `ToggleButtonBar`            | `ToggleButtonGroup` (`ToggleButton`)        | generated | Action     | 3        |
| `ToggleButtonGroup`          | `SegmentedControl` (`SegmentedControl`)     | designed  | Action     | 1        |
| `ToggleButtonGroupSegment`   | `SegmentedControlItem` (`SegmentedControl`) | generated | Action     | 0        |
| `Tokenizer`                  | `Tokenizer` (`Tokenizer`)                   | generated | Forms      | 8        |
| `Toolbar`                    | `Toolbar` (`Toolbar`)                       | generated | Action     | 4        |
| `Tooltip`                    | `Tooltip` (`Tooltip`)                       | designed  | Overlay    | 4        |
| `TopNav`                     | `TopNav` (`TopNav`)                         | generated | Navigation | 7        |
| `TopNavHeading`              | `TopNavHeading` (`TopNav`)                  | generated | Navigation | 2        |
| `TopNavItem`                 | `TopNavItem` (`TopNav`)                     | generated | Navigation | 2        |
| `TopNavMegaMenu`             | `TopNavMegaMenu` (`TopNav`)                 | generated | Navigation | 2        |
| `TopNavMegaMenuFeaturedCard` | `TopNavMegaMenuFeaturedCard` (`TopNav`)     | generated | Navigation | 2        |
| `TopNavMegaMenuItem`         | `TopNavMegaMenuItem` (`TopNav`)             | generated | Navigation | 2        |
| `TopNavMenu`                 | `TopNavMenu` (`TopNav`)                     | generated | Navigation | 2        |
| `TreeView`                   | `TreeList` (`TreeList`)                     | designed  | Data       | 1        |
| `VisuallyHidden`             | `VisuallyHidden` (`VisuallyHidden`)         | generated | Content    | 2        |
| `VStack`                     | `VStack` (`VStack`)                         | designed  | Layout     | 2        |

<!-- /generated:surface-table -->

## Examples and page templates

Every example beside a Tecton component, and every page template under
`packages/react/src/templates`, is a _translation_ of the upstream example
blocks rather than a copy. `packages/react/scripts/port-examples.mjs` reads
each one with the TypeScript parser and rewrites it: imports become relative
Tecton imports, component names go through the manifest, props go through
`port-examples.mapping.mjs`, and glyphs are substituted for the closest of
Tecton's 131.

The port is one-shot but re-runnable — a ported example records
`origin: 'ported'` in its own documentation, which is how a re-run takes back
exactly its own output — and it is **not** part of the build. Re-run it after
an upstream upgrade and read the diff.

`docs/engineering/ported-examples.log` is the full record: every glyph
substituted, every prop dropped in translation, every file refused and every
file removed because it would not compile, each with its reason. Four kinds of
thing do not survive the port, and none of them is a shortcut:

1. **A dependency Tecton does not ship.** Five page templates draw charts with
   a charting library, and a few blocks reach for StyleX token variables that
   Tecton does not publish. Tecton would have to take on a dependency or
   publish its token variables to keep them.

The page templates are where this bites hardest: 12 of 53 survive. A template
is a whole screen, so it usually touches at least one of the components Tecton
redesigned, and one blocker is enough to remove the file. Every one of the 41
that did not make it is in the log with the compiler's own first complaint, and
each is a candidate for a hand-written Tecton template rather than a
translation. 2. **A model Tecton deliberately does not have.** Tecton's Menu, Select,
CheckboxGroup, RadioGroup, TreeView and Table take **data**, not children;
an upstream example written as `<Selector><SelectorOption/></Selector>` has
no mechanical translation. These are the bulk of the removals, and each one
is a candidate for a hand-written Tecton example instead. 3. **A prop Tecton dropped that the example was about.** Where dropping the
prop left a required prop missing, the example went with it. 4. **A pattern the repository's lint rules forbid** — reading a ref or the
clock during render. Those are listed in `EXCLUDED` in
`port-examples.mapping.mjs` with the reason, because an example is code
people copy.

## Where the wrappers are checked

- `scripts/check-consumer-surface.mjs` — no upstream name in any published
  subpath's declarations, including in a type alias's right-hand side or a doc
  comment.
- `scripts/check-docs-drift.mjs` — every component has a doc, every documented
  prop exists, every declared prop is documented, every example exists and
  type-checks.
- `packages/react/scripts/generate-icons.mjs --check` — the generated icons
  still match the delivery.
