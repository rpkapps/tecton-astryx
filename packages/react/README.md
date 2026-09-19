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

## Fonts

The theme names Figtree for body and heading text and IBM Plex Mono for code; it
does not load them. Add them to your document, for example:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
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
