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
import {
  TectonProvider,
  Card,
  Heading,
  Text,
  VStack,
  Button,
} from '@tecton/react';

export function App() {
  return (
    <TectonProvider mode="dark">
      <Card>
        <VStack gap={3}>
          <Heading level={2}>Deployments</Heading>
          <Text>Everything shipped in the last hour.</Text>
          <Button label="Run" variant="primary" />
        </VStack>
      </Card>
    </TectonProvider>
  );
}
```

That is the whole of Tecton's own API: one provider, one stylesheet. Everything
else you import from `@tecton/react` is the component system itself — its
names, its props, its documentation — with Tecton's palette, type scale, radii
and icons applied to it by the theme the provider installs. There is no Tecton
wrapper in front of a component, so there is nothing to learn twice and nothing
that can fall behind.

Every module is also a subpath, so an application can pull in one component
without the barrel:

```tsx
import {Button} from '@tecton/react/Button';
import {Table, useTableSortable} from '@tecton/react/Table';
import {useMediaQuery} from '@tecton/react/hooks';
import {tecton, tectonToken} from '@tecton/react/theme';
import {DrillBitIcon} from '@tecton/react/icons';
```

## Modules

Everything below is exported from the package root as well, so
`import {Button} from '@tecton/react'` and
`import {Button} from '@tecton/react/Button'` are the same component. Pick
the subpath when you would rather not pull the whole surface through one
module.

122 subpaths, plus 5 stylesheet entry points
(`@tecton/react/styles.css`, `@tecton/react/styles-no-reset.css`, `@tecton/react/tokens.css`, `@tecton/react/components.css`, `@tecton/react/components-no-reset.css`).

|                                 |                                        |                                     |
| ------------------------------- | -------------------------------------- | ----------------------------------- |
| `@tecton/react/AlertDialog`     | `@tecton/react/Heading`                | `@tecton/react/Section`             |
| `@tecton/react/AppShell`        | `@tecton/react/hooks`                  | `@tecton/react/SegmentedControl`    |
| `@tecton/react/AspectRatio`     | `@tecton/react/HoverCard`              | `@tecton/react/SelectableCard`      |
| `@tecton/react/Avatar`          | `@tecton/react/HStack`                 | `@tecton/react/Selector`            |
| `@tecton/react/AvatarGroup`     | `@tecton/react/i18n`                   | `@tecton/react/Selector/utils`      |
| `@tecton/react/Badge`           | `@tecton/react/Icon`                   | `@tecton/react/SideNav`             |
| `@tecton/react/Banner`          | `@tecton/react/IconButton`             | `@tecton/react/SizeContext`         |
| `@tecton/react/BaseProps`       | `@tecton/react/icons`                  | `@tecton/react/Skeleton`            |
| `@tecton/react/Blockquote`      | `@tecton/react/Indicator`              | `@tecton/react/Slider`              |
| `@tecton/react/BottomSheet`     | `@tecton/react/InputGroup`             | `@tecton/react/Spinner`             |
| `@tecton/react/Breadcrumbs`     | `@tecton/react/InteractiveRoleContext` | `@tecton/react/Stack`               |
| `@tecton/react/Button`          | `@tecton/react/Item`                   | `@tecton/react/StatusDot`           |
| `@tecton/react/ButtonGroup`     | `@tecton/react/Kbd`                    | `@tecton/react/Stepper`             |
| `@tecton/react/Calendar`        | `@tecton/react/Layer`                  | `@tecton/react/Switch`              |
| `@tecton/react/Calendar/utils`  | `@tecton/react/Layout`                 | `@tecton/react/Table`               |
| `@tecton/react/Card`            | `@tecton/react/Lightbox`               | `@tecton/react/Table/utils`         |
| `@tecton/react/Carousel`        | `@tecton/react/Link`                   | `@tecton/react/TabList`             |
| `@tecton/react/Center`          | `@tecton/react/List`                   | `@tecton/react/Text`                |
| `@tecton/react/Chat`            | `@tecton/react/locales/*.json`         | `@tecton/react/TextArea`            |
| `@tecton/react/CheckboxInput`   | `@tecton/react/Markdown`               | `@tecton/react/TextInput`           |
| `@tecton/react/CheckboxList`    | `@tecton/react/Markdown/utils`         | `@tecton/react/theme`               |
| `@tecton/react/Citation`        | `@tecton/react/MetadataList`           | `@tecton/react/theme/syntax`        |
| `@tecton/react/ClickableCard`   | `@tecton/react/MobileNav`              | `@tecton/react/theme/tokens`        |
| `@tecton/react/Code`            | `@tecton/react/MoreMenu`               | `@tecton/react/theme/tokens.stylex` |
| `@tecton/react/CodeBlock`       | `@tecton/react/MultiSelector`          | `@tecton/react/Thumbnail`           |
| `@tecton/react/Collapsible`     | `@tecton/react/naming`                 | `@tecton/react/TimeInput`           |
| `@tecton/react/CommandPalette`  | `@tecton/react/NavIcon`                | `@tecton/react/Timestamp`           |
| `@tecton/react/ComplexSelector` | `@tecton/react/NavMenu`                | `@tecton/react/Toast`               |
| `@tecton/react/ContextMenu`     | `@tecton/react/NumberInput`            | `@tecton/react/ToggleButton`        |
| `@tecton/react/DateInput`       | `@tecton/react/Outline`                | `@tecton/react/Token`               |
| `@tecton/react/DateRangeInput`  | `@tecton/react/OverflowList`           | `@tecton/react/Tokenizer`           |
| `@tecton/react/DateTimeInput`   | `@tecton/react/Overlay`                | `@tecton/react/Toolbar`             |
| `@tecton/react/Dialog`          | `@tecton/react/Pagination`             | `@tecton/react/Tooltip`             |
| `@tecton/react/Divider`         | `@tecton/react/Popover`                | `@tecton/react/TopNav`              |
| `@tecton/react/DropdownMenu`    | `@tecton/react/PowerSearch`            | `@tecton/react/TreeList`            |
| `@tecton/react/EmptyState`      | `@tecton/react/PowerSearch/utils`      | `@tecton/react/Typeahead`           |
| `@tecton/react/Field`           | `@tecton/react/ProgressBar`            | `@tecton/react/Typeahead/utils`     |
| `@tecton/react/FieldStatus`     | `@tecton/react/RadioList`              | `@tecton/react/utils`               |
| `@tecton/react/FileInput`       | `@tecton/react/Resizable`              | `@tecton/react/VisuallyHidden`      |
| `@tecton/react/FormLayout`      | `@tecton/react/Resizable/utils`        | `@tecton/react/VStack`              |
| `@tecton/react/Grid`            | `@tecton/react/ScrollableArea`         |                                     |

## Theme

`@tecton/react/theme` carries both halves of theming:

- **Tecton's theme** — `tectonTheme`, `tecton`, `tectonToken` and `tectonIcons`.
  You rarely touch it: `TectonProvider` applies it for you.
- **The theme runtime** — `Theme`, `defineTheme`, `useTheme`, `useThemeName`
  and the token variable maps, for an application defining a theme of its own
  or reading the one in force.

```tsx
import {useThemeName, tecton} from '@tecton/react/theme';
```

## Icons

131 glyphs drawn for Tecton, about a quarter of them subsurface shapes with no
equivalent anywhere else. Every glyph paints in `currentColor`, so an icon takes
the colour of the text beside it.

They arrive in two ways.

**Through the theme.** Tecton's theme registers its glyphs against the semantic
roles components ask for — `close`, `check`, `chevronDown`, `search`, `warning`
and the rest — so a component that draws its own icon draws a Tecton one with
nothing imported:

```tsx
import {TextInput} from '@tecton/react';

<TextInput label="Search" value={query} onChange={setQuery} isClearable />;
```

**As components.** For the icons an application draws itself, import the glyph:

```tsx
import {DrillBitIcon, WarningIcon} from '@tecton/react/icons';
import {Button, Icon} from '@tecton/react';

<Button label="Add horizon" icon={<DrillBitIcon />} />
<Icon icon={WarningIcon} size="lg" label="Warning" />
<DrillBitIcon width={20} height={20} aria-hidden="true" />;
```

`tectonIconNames` lists every glyph name and `tectonIconRegistry` maps a name to
its component, for the rare case that needs to look one up at run time. An icon
is decorative by default and hidden from assistive technology; give it an
accessible name only when the glyph carries meaning nothing else repeats. Two
cuts — `outline` and `filled` — come from the same artwork, and `strata` is the
one glyph that carries its own colour.

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

`Text` and `Heading` name one with their `type` prop — `<Text type="smallData">`
— and eight of the sixteen are Tecton's own, added by the theme rather than
built in: `mediumStrong`, `smallStrong`, `tiny`, `largeData`, `mediumData`,
`smallData`, `actionMedium` and `actionSmall`. They type-check like the rest,
because the theme ships the declarations for them.

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
