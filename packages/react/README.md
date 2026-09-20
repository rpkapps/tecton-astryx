# @tecton/react

Tecton design system components for React 19.

## Install

```bash
pnpm add @tecton/react react react-dom
```

`react` and `react-dom` (>= 19) are the only peer dependencies. Everything else
Tecton needs ships inside the package: compiled ESM, type declarations, one
stylesheet, and the component library Tecton is implemented on, vendored into
`dist/vendor/` with every import pointing at it. No Babel, PostCSS or bundler
plugin is required, and there is nothing else to install or keep in step — the
install line above is the whole story, and stays the whole story when Tecton
upgrades what it is built on.

## Usage

Import the stylesheet once, as early as your other global CSS, and wrap the app
in `TectonProvider`:

```tsx
import '@tecton/react/styles.css';
import {TectonProvider, Panel, Button} from '@tecton/react';

export function App() {
  return (
    <TectonProvider mode="dark">
      <Panel
        title="Deployments"
        description="Everything shipped in the last hour."
        actions={<Button label="Run" variant="primary" />}
      >
        <p>Nothing to report.</p>
      </Panel>
    </TectonProvider>
  );
}
```

Components are also available as subpath imports, so an application can pull in
one component without the barrel:

```tsx
import {Button} from '@tecton/react/Button';
import {Panel} from '@tecton/react/Panel';
import {tecton, tectonToken} from '@tecton/react/theme';
import {Icon} from '@tecton/react/icons';
```

## Components

180 components, every one exported from the package root and from its
own subpath (`@tecton/react/Button`). The hooks and data types they need are
at `@tecton/react/support`, the icon set at `@tecton/react/icons`, the tokens
at `@tecton/react/theme` and the page templates at `@tecton/react/templates`.

48 of them are designed: Tecton names the props, narrows
the choices and writes the documentation. The other 132 are published as they
are, under Tecton names and with Tecton glyphs on their icon props; they are
generated from `wrappers.manifest.json`, and
`docs/engineering/component-mapping.md` says which is which and why.

Between them they carry 556 runnable examples and 12 page templates.

### Action

| Component                  | What it is                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `Button`                   | Button triggers an action: submitting a form, confirming a choice, starting a job.                                           |
| `ButtonGroup`              | ButtonGroup joins buttons into one control for actions that belong together — a set of exports, a split action and its menu. |
| `ContextMenu`              | A right-click context menu that appears at the cursor position.                                                              |
| `ContextMenuItem`          | Menu item component for compound mode.                                                                                       |
| `Fab`                      | Fab is the one action a screen is really for, lifted off the surface and pinned where it can always be reached.              |
| `IconButton`               | IconButton is a button whose whole content is one glyph.                                                                     |
| `Menu`                     | Menu is a button that opens a list of actions.                                                                               |
| `MenuActionItem`           | Helper component for custom item rendering with consistent styling.                                                          |
| `MenuCheckboxItem`         | A checkable menu item (role="menuitemcheckbox") that toggles an independent boolean.                                         |
| `MenuRadioGroup`           | A single-select group of radio menu items (role="group" of menuitemradio).                                                   |
| `MenuRadioItem`            | A single option in a MenuRadioGroup (role="menuitemradio").                                                                  |
| `MenuSeparator`            | A horizontal rule separating groups of rows in a compound menu.                                                              |
| `MenuSubMenu`              | A single menu row that reveals a nested flyout of its own items.                                                             |
| `MoreMenu`                 | MoreMenu is a three-dot button that opens a list of actions.                                                                 |
| `ToggleButton`             | ToggleButton is a button that stays down: a setting that is on, a layer that is shown, a panel that is open.                 |
| `ToggleButtonBar`          | Groups toggle buttons for exclusive (single) or multi-select behavior.                                                       |
| `ToggleButtonGroup`        | ToggleButtonGroup is a row of segments of which exactly one is chosen — a view switch, a unit, a density.                    |
| `ToggleButtonGroupSegment` | Individual segment item rendering as a radio button within the segmented control.                                            |
| `Toolbar`                  | Toolbar is a horizontal bar with left, center, and right areas.                                                              |

### Forms

| Component          | What it is                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Autocomplete`     | Autocomplete narrows a long list as the person types.                                                                                         |
| `AutocompleteBase` | Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown.                                 |
| `AutocompleteItem` | Default dropdown item renderer for typeahead results.                                                                                         |
| `Calendar`         | Calendar lets the user pick a date or date range from a month grid.                                                                           |
| `Checkbox`         | Checkbox is one independent choice: on, off, or — when it stands for a set of choices below it — indeterminate.                               |
| `CheckboxGroup`    | CheckboxGroup is a labelled set of checkboxes sharing one value: the keys that are checked.                                                   |
| `ComplexSelector`  | Use ComplexSelector when a selection needs richer custom content than a Select option row.                                                    |
| `DateInput`        | DateInput lets the user type or pick a date from a calendar popover.                                                                          |
| `DateRangeInput`   | DateRangeInput lets users select a start and end date from a dual-month calendar popover.                                                     |
| `DateTimeInput`    | DateTimeInput combines date and time selection in one field.                                                                                  |
| `Field`            | Field is a low-level wrapper for custom, native, or third-party controls that do not already provide field label, description, and status UI. |
| `FieldLabel`       | Standalone label component with optional/required indicators and tooltip support.                                                             |
| `FieldMessage`     | FieldMessage renders validation feedback for fields and field-like controls.                                                                  |
| `FileInput`        | FileInput provides file upload with optional drag-and-drop support.                                                                           |
| `InputGroup`       | InputGroup connects an input with prefix/suffix addons in a single visual unit.                                                               |
| `InputGroupText`   | A prefix or suffix text element rendered inside InputGroup.                                                                                   |
| `MultiSelector`    | A checkbox dropdown for selecting multiple values from a list.                                                                                |
| `NumberInput`      | A form input for numeric values with built-in validation, min/max constraints, and step controls.                                             |
| `PowerSearch`      | PowerSearch is a structured filter bar where each token represents a field, operator, and value.                                              |
| `Radio`            | Radio is one option inside a RadioGroup.                                                                                                      |
| `RadioGroup`       | RadioGroup is a labelled set of mutually exclusive options.                                                                                   |
| `Select`           | Select picks one value from a known list.                                                                                                     |
| `SelectChoice`     | Helper component for custom item rendering inside an Select renderOption prop.                                                                |
| `Slider`           | Slider picks a number, or a range of two, by position rather than by typing.                                                                  |
| `Switch`           | Switch is an immediate on/off setting — it takes effect the moment it is flipped, with no separate save.                                      |
| `TextArea`         | TextArea takes several lines of text, in the same outlined appearance as TextField.                                                           |
| `TextField`        | TextField takes one line of text: a name, a query, a number typed in.                                                                         |
| `TimeInput`        | It converts values to a standard format and supports arrow-key adjustment on the typed surface.                                               |
| `Tokenizer`        | Tokenizer is a multi-select input that lets users search, select, and manage multiple items displayed as removable chips.                     |

### Content

| Component             | What it is                                                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Avatar`              | Avatar stands for a person or a thing: a photograph if there is one, initials if there is not.                                                                    |
| `AvatarGroup`         | AvatarGroup shows several avatars as one overlapping run, with a `+N` marker once there are more than fit.                                                        |
| `AvatarGroupOverflow` | AvatarGroupOverflow appears at the end of an AvatarGroup to summarize people who are not shown individually.                                                      |
| `AvatarStatusDot`     | Size-aware status indicator dot that reads avatar size from context and scales proportionally.                                                                    |
| `Badge`               | Badge is a small pill that labels the thing next to it — a state, a count, a category.                                                                            |
| `Blockquote`          | A quotation block with a rule on its inline-start edge and secondary text color.                                                                                  |
| `Chip`                | Chip is a compact label for one value the person put there: a filter that is on, a tag on a record, a selection they can take back.                               |
| `Citation`            | Citations display inline references to external sources.                                                                                                          |
| `Code`                | Inline code element.                                                                                                                                              |
| `CodeBlock`           | CodeBlock renders syntax-highlighted code with line numbers, a copy button, and optional collapsible sections.                                                    |
| `ColorSwatch`         | ColorSwatch is a small square of colour standing for a series, a facies or a horizon.                                                                             |
| `EmptyState`          | EmptyState shows a placeholder when a content area has no data.                                                                                                   |
| `Icon`                | Icon draws one of the 131 Tecton glyphs.                                                                                                                          |
| `Kbd`                 | Renders a keyboard shortcut as styled key badges.                                                                                                                 |
| `Markdown`            | Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling. |
| `Thumbnail`           | Thumbnail displays a compact, square preview of an image attachment.                                                                                              |
| `Timestamp`           | Timestamp formats a date or time value into human-readable text.                                                                                                  |
| `VisuallyHidden`      | Renders content in the accessibility tree while hiding it visually.                                                                                               |

### Typography

| Component | What it is                                                   |
| --------- | ------------------------------------------------------------ |
| `Heading` | Heading names a section.                                     |
| `Text`    | Text sets a run of words in one of the Tecton type variants. |

### Feedback

| Component   | What it is                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Alert`     | Alert states something about the system that the person needs to know: a job failed, a file saved, a licence is about to expire. |
| `Progress`  | Progress reports how far along something is.                                                                                     |
| `Skeleton`  | An animated shimmer placeholder that previews the shape of content while it loads.                                               |
| `StatusDot` | A small colored dot that communicates status like online/offline presence or severity levels.                                    |
| `Toast`     | useToast raises a short, transient message about something that just happened, and hands back a way to take it down again.       |

### Data

| Component          | What it is                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ItemRow`          | Use it wherever you need a structured row: dropdown menus, selectors, contact lists, notifications, file browsers, and activity feeds.            |
| `List`             | List is a vertical run of rows that belong to one collection.                                                                                     |
| `ListItem`         | ListItem is one row of a List: a label, optionally a second line under it, and content at either end.                                             |
| `MetadataList`     | MetadataList displays key-value pairs for object attributes like quality, condition, and status, in a structured layout.                          |
| `MetadataListItem` | A single labeled metadata value within an MetadataList.                                                                                           |
| `OverflowList`     | A horizontal list that automatically hides items when they exceed the available width.                                                            |
| `Table`            | Table shows rows of records with one column per field.                                                                                            |
| `TableBody`        | <tbody> wrapper for children mode.                                                                                                                |
| `TableCell`        | <td> wrapper that reads TableContext to apply density padding, font size, and divider borders when used inside Table.                             |
| `TableFooter`      | <tfoot> wrapper for children mode.                                                                                                                |
| `TableHeader`      | <thead> wrapper for children mode.                                                                                                                |
| `TableHeaderCell`  | <th> wrapper that reads TableContext to apply density padding, semibold weight, secondary text color, and divider borders when used inside Table. |
| `TableRow`         | <tr> wrapper that reads TableContext to apply striped, hover, and divider styles when used inside Table.                                          |
| `TreeView`         | TreeView shows a hierarchy of rows that open and close: a project's folders, a well's horizons, a model's inputs.                                 |

### Navigation

| Component                    | What it is                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `BreadcrumbItem`             | BreadcrumbItem is one crumb in a Breadcrumbs trail.                                                                               |
| `Breadcrumbs`                | Breadcrumbs show where a page sits in the hierarchy and let someone step back up it.                                              |
| `Link`                       | Link takes the person somewhere else.                                                                                             |
| `MobileNav`                  | A slide-out drawer for mobile navigation.                                                                                         |
| `MobileNavToggle`            | MobileNavToggle is published as part of the Tecton surface.                                                                       |
| `NavHeadingMenu`             | Accessible menu container and items for nav heading popovers.                                                                     |
| `NavHeadingMenuItem`         | NavHeadingMenuItem is published as part of the Tecton surface.                                                                    |
| `NavIcon`                    | NavIcon is a circular icon container with an accent-colored background.                                                           |
| `Outline`                    | A table-of-contents sidebar for documentation pages, help centers, wikis, and long settings pages.                                |
| `Pagination`                 | Pagination lets users step through pages of content.                                                                              |
| `SideNav`                    | A sidebar navigation component for organizing application pages with sections, nested items, and icons.                           |
| `SideNavCollapseButton`      | Toggle button for sidenav collapse.                                                                                               |
| `SideNavHeading`             | Product/suite/account heading with smart interaction boundary logic for links and a menu popover.                                 |
| `SideNavItem`                | Navigation item with icon, selected state, optional end content, and nesting support via children.                                |
| `SideNavSection`             | Section grouping with an optional title, subtitle, and end content.                                                               |
| `Step`                       | Individual step within a Stepper.                                                                                                 |
| `Stepper`                    | Steppers display progress through a sequence of logical and numbered steps.                                                       |
| `Tab`                        | Tab is one stop in a Tabs strip.                                                                                                  |
| `TabMenu`                    | Overflow menu trigger that opens a dropdown of additional tab options, showing the selected option's label as the trigger text.   |
| `Tabs`                       | Tabs is the strip that holds a set of Tab stops and knows which is current.                                                       |
| `TopNav`                     | TopNav is a horizontal navigation bar for product-level navigation in application headers.                                        |
| `TopNavHeading`              | Product/suite/account heading for the TopNav heading slot.                                                                        |
| `TopNavItem`                 | Navigation link item for use in TopNav startContent: renders as an anchor with hover and selected states.                         |
| `TopNavMegaMenu`             | Navigation item that displays a full-width mega menu panel on hover.                                                              |
| `TopNavMegaMenuFeaturedCard` | Standard featured card for the TopNavMegaMenu featured slot.                                                                      |
| `TopNavMegaMenuItem`         | An individual item inside an TopNavMegaMenu.                                                                                      |
| `TopNavMenu`                 | Navigation item that displays a hover-triggered popover menu with rich items containing an icon, title, and optional description. |

### Surfaces

| Component        | What it is                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Accordion`      | Accordion hides a block of content behind a header that opens it.                                                                                                        |
| `AccordionGroup` | AccordionGroup coordinates a stack of accordions.                                                                                                                        |
| `Card`           | Card bounds one thing: a record, a summary, a choice.                                                                                                                    |
| `Carousel`       | Carousel scrolls a row of items horizontally when they overflow the available width.                                                                                     |
| `ClickableCard`  | An interactive card for navigation or action targets.                                                                                                                    |
| `Panel`          | Panel is the titled surface Tecton builds screens out of: a header row with a title, optional actions and an optional close, a 1px rule under it, and the content below. |
| `SelectableCard` | A card that toggles between selected and unselected states with an accent border.                                                                                        |

### Overlay

| Component                 | What it is                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BottomSheet`             | A mobile touch surface for filters, actions, forms, and detail views that should rise from the bottom of the viewport; use BottomSheetSwitcher for multi-step flows. |
| `BottomSheetSwitcher`     | Coordinates a multi-step bottom-sheet flow in one shared dialog; set activeSheet to a nested BottomSheet's sheetId to open or switch steps, and to null to close.    |
| `CommandPalette`          | CommandPalette is a searchable dialog for quick access to commands, navigation, and actions.                                                                         |
| `CommandPaletteEmpty`     | Empty state display for the results area.                                                                                                                            |
| `CommandPaletteFooter`    | Footer showing keyboard navigation hints.                                                                                                                            |
| `CommandPaletteGroup`     | Visual grouping with a heading label.                                                                                                                                |
| `CommandPaletteInput`     | Search input slot.                                                                                                                                                   |
| `CommandPaletteItem`      | A selectable item.                                                                                                                                                   |
| `CommandPaletteList`      | Scrollable results container.                                                                                                                                        |
| `ContextMenuCheckboxItem` | ContextMenuCheckboxItem is published as part of the Tecton surface.                                                                                                  |
| `ContextMenuRadioGroup`   | ContextMenuRadioGroup is published as part of the Tecton surface.                                                                                                    |
| `ContextMenuRadioItem`    | ContextMenuRadioItem is published as part of the Tecton surface.                                                                                                     |
| `ContextMenuSeparator`    | ContextMenuSeparator is published as part of the Tecton surface.                                                                                                     |
| `ContextMenuSubMenu`      | ContextMenuSubMenu is published as part of the Tecton surface.                                                                                                       |
| `Dialog`                  | Dialog interrupts: it takes the screen until it is answered.                                                                                                         |
| `DialogHeader`            | Use DialogHeader to give a dialog a labelled title area and optional close control.                                                                                  |
| `HoverCard`               | HoverCard shows additional information when the user hovers or focuses a trigger element.                                                                            |
| `Lightbox`                | A fullscreen overlay for viewing images and videos at full resolution.                                                                                               |
| `Overlay`                 | Overlay layers action or supporting content over media, cards, video, or other bounded surfaces with an optional scrim and reveal behavior.                          |
| `Popover`                 | A click-triggered overlay anchored to a button or trigger element.                                                                                                   |
| `Tooltip`                 | Tooltip is a short note revealed on hover and keyboard focus.                                                                                                        |

### Layout

| Component        | What it is                                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`       | AppShell is the page shell for an application.                                                                                            |
| `AspectRatio`    | Maintains a fixed width-to-height ratio for its children as its container resizes.                                                        |
| `Center`         | Center aligns content to the middle of its container.                                                                                     |
| `Divider`        | Divider is a hairline between two pieces of content.                                                                                      |
| `FormLayout`     | A layout container that arranges form fields with consistent spacing and direction.                                                       |
| `Grid`           | Grid lays children out in columns.                                                                                                        |
| `GridSpan`       | Grid item that spans multiple columns or rows.                                                                                            |
| `HStack`         | HStack is a Stack that runs left to right.                                                                                                |
| `Layout`         | Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. |
| `LayoutContent`  | Scrollable main content area.                                                                                                             |
| `LayoutFooter`   | Bottom bar for action bars, pagination, and status bars.                                                                                  |
| `LayoutHeader`   | Top bar for page titles, app bars, and toolbars.                                                                                          |
| `LayoutPanel`    | Sidebar for navigation, settings, or inspector panels.                                                                                    |
| `ResizeHandle`   | Hook-based resizable panel system.                                                                                                        |
| `ScrollableArea` | Provides a native scroll viewport and a real observed content box.                                                                        |
| `Section`        | Section is the correct way to create page regions and group related content on a page.                                                    |
| `Stack`          | Stack lays children out in one direction with an even gap between them.                                                                   |
| `StackItem`      | StackItem is published as part of the Tecton surface.                                                                                     |
| `VStack`         | VStack is a Stack that runs top to bottom.                                                                                                |

### Chat

| Component                  | What it is                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ChatComposer`             | Layout shell for a chat composer.                                                                                          |
| `ChatComposerDrawer`       | Accordion drawer panel that sits above the chat input inside ChatComposer.                                                 |
| `ChatComposerInput`        | Rich text input for the chat composer.                                                                                     |
| `ChatComposerTokenElement` | Renders a single token chip outside the contentEditable input.                                                             |
| `ChatDictationButton`      | ChatDictationButton is a toggle button that starts and stops voice dictation inside a chat composer.                       |
| `ChatLayout`               | ChatLayout is the layout shell for full-page chat interfaces.                                                              |
| `ChatLayoutScrollButton`   | Floating scroll-to-bottom button that appears when the user scrolls away from the latest messages.                         |
| `ChatMessage`              | Sender context wrapper: handles avatar, name, metadata, and alignment based on sender role.                                |
| `ChatMessageBubble`        | Styled content container for the chat "bubble." Reads sender from parent ChatMessage context to auto-style the background. |
| `ChatMessageList`          | Presentational message container with density context and infinite scroll support.                                         |
| `ChatMessageMetadata`      | Composable metadata row for chat messages.                                                                                 |
| `ChatSendButton`           | Circular send/stop toggle button for the chat composer.                                                                    |
| `ChatSystemMessage`        | Centered system message for non-sender content like date separators, membership changes, and status notices.               |
| `ChatTokenizedText`        | Renders a text string with token patterns replaced by inline Badge components.                                             |
| `ChatToolCalls`            | ChatToolCalls displays tool or function call invocations from an LLM response.                                             |

### Providers

| Component        | What it is                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `CodeTheme`      | Applies syntax highlighting colors to CodeBlock and any code component in the subtree.                                 |
| `LinkProvider`   | Wraps your app to replace the default <a> tag with a framework-specific link component (e.g.                           |
| `LocaleProvider` | Wraps your app to set the active locale and (optionally) merge additional translation catalogs + per-locale overrides. |
| `SurfaceTheme`   | Provides token overrides for content rendered on inverted surfaces: media overlays, scrims, toasts, and tooltips.      |

`docs/engineering/component-mapping.md` in the repository lists, for each
component, what it is built on, how the props map, and where Tecton’s design
and what the component can express disagree.

## Icons

131 glyphs drawn for Tecton, about a quarter of them subsurface shapes with no
equivalent anywhere else. Every glyph paints in `currentColor`, so an icon takes
the colour of the text beside it.

```tsx
import {Icon, DrillBitIcon} from '@tecton/react/icons';

<Icon name="drill-bit" size={20} />
<Icon name="warning" size={24} label="Warning" />
<DrillBitIcon />;
```

Any Tecton prop that takes an icon takes a glyph **name**, so nothing a Tecton
component needs is ever imported from anywhere else:

```tsx
<Button label="Add horizon" icon="add" />
<TextField label="Search" value={query} onChange={setQuery} startIcon="search" />
```

An icon is decorative by default and hidden from assistive technology; pass
`label` only when the glyph carries meaning nothing else repeats. Two cuts —
`outline` and `filled` — come from the same artwork, and `strata` is the one
glyph that carries its own colour.

## Colour mode

`TectonProvider` renders in dark mode by default. Pass `mode="light"` to force
the light scheme or `mode="system"` to follow the operating system preference.

Tecton is designed dark. Every light value is derived from the dark one — same
colour family, same step on the ramp — which is coherent but is not a designed
light palette. See `docs/design/light-mode.md` in the repository for the rule
and its known weak spots.

## Design tokens

Every Tecton design token is a CSS custom property set by the theme, so reading
one costs nothing and switching colour mode needs no re-render. The `tecton`
map names them by the role they play:

```tsx
import {tecton} from '@tecton/react';

<div
  style={{
    background: tecton.color.surface.card,
    color: tecton.color.text.primary,
    border: `${tecton.border.width} solid ${tecton.color.divider.subtle}`,
    borderRadius: tecton.radius.container,
    padding: tecton.space.lg,
  }}
/>;
```

The map covers text, icon, surface, action, divider, status (five severities,
including the `info` and `neutral` ones), the seven accent colours, the table
and top-nav surfaces, the input colours, radius, spacing, control size,
typography, elevation and border width. `tectonToken('--color-accent')` is the
escape hatch for a property the map does not name.

Two things worth knowing about the palette:

- **Elevation runs dark.** A Tecton panel is _darker_ than the page it sits on,
  and content inside it steps back up in lightness. `tecton.color.surface.card`
  is darker than `tecton.color.surface.body` in dark mode.
- **Selection is a bright chip, not an accent.** A checked box or a selected
  radio fills near-white with dark ink. Only the switch carries the violet.

## Type

Sixteen text styles, in three groups: interface (`display1`–`3`, `heading1`–`2`,
`large`, `medium`, `mediumStrong`, `small`, `smallStrong`, `tiny`), data
(`largeData`, `mediumData`, `smallData` — monospace with tabular figures, for
anything measured) and action (`actionMedium`, `actionSmall`).

`Text` carries the fourteen non-heading variants and `Heading` the rest;
`weight` names all four steps — `regular`, `medium`, `semibold`, `bold`. The
Tecton foundation defines two weights, 400 and 500, so `semibold` and `bold`
resolve to the heaviest the theme carries, which today are 500 and 600.

## Fonts

The theme names Figtree for body and heading text and IBM Plex Mono for code; it
does not load them. Add them to your document, for example:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
/>
```

## What is in the package

| Path                | Contents                                              |
| ------------------- | ----------------------------------------------------- |
| `dist/index.js`     | Compiled ESM entry point                              |
| `dist/tecton.css`   | `@tecton/react/styles.css` — the one stylesheet       |
| `dist/css/*.css`    | The same CSS in separate parts, for debugging         |
| `dist/theme/`       | The pre-built theme module, its CSS and icons         |
| `dist/vendor/core/` | The library Tecton is built on — internal, not an API |

`dist/vendor/` is Tecton's own business: it is not exported, nothing public
re-exports from it, and its contents can change in any release. Import from
`@tecton/react` and its documented subpaths only.

See `docs/engineering/build-pipeline.md` in the repository for how these are
produced.
