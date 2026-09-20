# @tecton/react

Tecton design system components for React 19.

## Install

```bash
pnpm add @tecton/react react react-dom
```

`react` and `react-dom` (>= 19) are the only peer dependencies. Everything else
Tecton needs ships inside the package: compiled ESM, type declarations and one
stylesheet. No Babel, PostCSS or bundler plugin is required.

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
import {tectonTheme, tectonToken} from '@tecton/react/theme';
```

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

The theme has two weights, 400 and 500, because the design has two. A component
asking for `semibold` gets 500.

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

| Path              | Contents                                        |
| ----------------- | ----------------------------------------------- |
| `dist/index.js`   | Compiled ESM entry point                        |
| `dist/tecton.css` | `@tecton/react/styles.css` — the one stylesheet |
| `dist/css/*.css`  | The same CSS in separate parts, for debugging   |
| `dist/theme/`     | The pre-built theme module, its CSS and icons   |

See `docs/engineering/build-pipeline.md` in the repository for how these are
produced.
