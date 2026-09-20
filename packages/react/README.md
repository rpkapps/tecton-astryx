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

Every component is exported from the package root and from its own subpath
(`@tecton/react/Button`). The icon set lives at `@tecton/react/icons` and the
tokens at `@tecton/react/theme`.

### Actions

| Component           | What it is                                                           |
| ------------------- | -------------------------------------------------------------------- |
| `Button`            | Triggers an action; five emphases from `primary` down to `textOnly`. |
| `ButtonGroup`       | Joins buttons into one control for actions that belong together.     |
| `Fab`               | The one action a screen is for, lifted off the surface.              |
| `IconButton`        | A button whose whole content is one glyph.                           |
| `Link`              | Navigates. Tecton links are marked by the underline, not by colour.  |
| `Menu`              | A button that opens a list of actions, described as data.            |
| `ToggleButton`      | A button that stays down — the activated look, as a state.           |
| `ToggleButtonGroup` | A row of segments of which exactly one is chosen.                    |

### Forms

| Component       | What it is                                                            |
| --------------- | --------------------------------------------------------------------- |
| `Autocomplete`  | Narrows a long list as the person types, from memory or from a fetch. |
| `Checkbox`      | One independent choice: on, off, or indeterminate.                    |
| `CheckboxGroup` | A labelled set of checkboxes sharing one value.                       |
| `Radio`         | One option inside a radio group.                                      |
| `RadioGroup`    | A labelled set of mutually exclusive options.                         |
| `Select`        | Picks one value from a known list, with optional search and sections. |
| `Slider`        | Picks a number, or a range of two, by position.                       |
| `Switch`        | An immediate on/off setting, with no separate save.                   |
| `TextArea`      | Several lines of text, in the outlined appearance.                    |
| `TextField`     | One line of text, in the outlined appearance.                         |

### Content and status

| Component     | What it is                                                              |
| ------------- | ----------------------------------------------------------------------- |
| `Alert`       | States something about the system; five statuses including `neutral`.   |
| `Avatar`      | A person or a thing, as a photograph or as initials.                    |
| `AvatarGroup` | Several avatars as one overlapping run, with a `+N` marker.             |
| `Badge`       | A small pill labelling the thing next to it.                            |
| `Chip`        | A compact label for a value the person put there; removable.            |
| `ColorSwatch` | A square of colour standing for a series, with the lime selection ring. |
| `Icon`        | One of the 131 Tecton glyphs, at 16, 20 or 24px.                        |
| `Progress`    | How far along something is, linear or circular.                         |
| `Tooltip`     | A short note revealed on hover and keyboard focus.                      |

### Data

| Component  | What it is                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| `List`     | A vertical run of rows belonging to one collection.                        |
| `ListItem` | One row of a list: a label, a second line, content at either end.          |
| `Table`    | Rows of records with one column per field; columns render their own cells. |
| `TreeView` | A hierarchy of rows that open and close.                                   |

### Navigation

| Component        | What it is                                                      |
| ---------------- | --------------------------------------------------------------- |
| `Breadcrumbs`    | The trail from the top of the hierarchy to where the person is. |
| `BreadcrumbItem` | One crumb in that trail.                                        |
| `Tabs`           | The strip that knows which stop is current.                     |
| `Tab`            | One stop in a tab strip, for a panel or for a page.             |

### Surfaces and overlays

| Component        | What it is                                                          |
| ---------------- | ------------------------------------------------------------------- |
| `Accordion`      | One disclosure: a header that opens the content under it.           |
| `AccordionGroup` | Coordinates a stack of accordions, one open at a time or many.      |
| `Card`           | Bounds one thing: a record, a summary, a choice.                    |
| `Dialog`         | Interrupts, for a decision or a consequence. Also the confirmation. |
| `Panel`          | The titled surface Tecton builds screens out of.                    |
| `useToast`       | Raises a short, transient message from a plain data payload.        |

### Layout and type

| Component                   | What it is                                                  |
| --------------------------- | ----------------------------------------------------------- |
| `Divider`                   | A hairline; three emphases, all 1px.                        |
| `Grid`                      | Columns, fixed in number or fitted to a minimum width.      |
| `Stack`, `HStack`, `VStack` | One direction, one gap, both on the 4px grid.               |
| `Heading`                   | Names a section; level sets the element and the size.       |
| `Text`                      | A run of words in one of the fourteen Tecton text variants. |

`docs/engineering/component-mapping.md` in the repository lists, for each
component, what it is built on, how the props map, and where Tecton's design
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
