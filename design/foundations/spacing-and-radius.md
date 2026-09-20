# Spacing and Corner Radii

> Transcribed verbatim from `screenshots/115_foundations-spacing-and-radius__overview.png`.

Tecton spacing and radius tokens are generated from the scientific density token set into CSS variables and TypeScript constants.

## Usage

Use spacing and radius tokens for layout rhythm, component padding, and corner shape. The active density source is Scientific; additional exported density sets are not part of the runtime contract until the token build supports density modes.

CSS variables are the public cross-framework contract; React code can import the generated constants from the theme entry.

| Card | Guidance | Example |
| --- | --- | --- |
| Source tokens | Use source paths when tracing generated values back to Token Studio. | `foundational.scale.space.200` |
| React and MUI | Import generated constants when component logic needs numeric token values. | `import { spacing, borderRadius } from '@tecton/ui/theme';` |
| CSS consumers | Use generated CSS variables for vanilla CSS, Angular, Tailwind, PrimeNG, and other adapters. | `var(--tecton-space-200)` |

A trailing `…` marks a description the page truncates with an ellipsis.

## Spacing

Spacing tokens define layout rhythm, component padding, grid gaps, and page-level separation.

| Token | Description | Value | Source token | CSS variable | TypeScript token |
| --- | --- | --- | --- | --- | --- |
| `space.0` | Remove spacing or collapse a gap. | 0px | `foundational.scale.space.0` | `--tecton-space-0` | `spacing['0']` |
| `space.25` | Hairline offset and very tight icon/text adjust… | 2px | `foundational.scale.space.25` | `--tecton-space-25` | `spacing['25']` |
| `space.50` | Tight inline gaps and compact control internals. | 4px | `foundational.scale.space.50` | `--tecton-space-50` | `spacing['50']` |
| `space.75` | Small offsets where 4px is too tight and 8px is… | 6px | `foundational.scale.space.75` | `--tecton-space-75` | `spacing['75']` |
| `space.100` | Default small spacing unit for compact groups. | 8px | `foundational.scale.space.100` | `--tecton-space-100` | `spacing['100']` |
| `space.150` | Comfortable internal padding and grouped lab… | 12px | `foundational.scale.space.150` | `--tecton-space-150` | `spacing['150']` |
| `space.200` | Standard component padding and common la… | 16px | `foundational.scale.space.200` | `--tecton-space-200` | `spacing['200']` |
| `space.250` | Medium layout spacing between related group… | 20px | `foundational.scale.space.250` | `--tecton-space-250` | `spacing['250']` |
| `space.300` | Large component spacing and section interiors. | 24px | `foundational.scale.space.300` | `--tecton-space-300` | `spacing['300']` |
| `space.400` | Small page section gaps. | 32px | `foundational.scale.space.400` | `--tecton-space-400` | `spacing['400']` |
| `space.500` | Medium page section gaps. | 40px | `foundational.scale.space.500` | `--tecton-space-500` | `spacing['500']` |
| `space.600` | Large page section gaps. | 48px | `foundational.scale.space.600` | `--tecton-space-600` | `spacing['600']` |
| `space.700` | Wide page spacing and major layout separation. | 56px | `foundational.scale.space.700` | `--tecton-space-700` | `spacing['700']` |
| `space.800` | Large layout rhythm for spacious compositions. | 64px | `foundational.scale.space.800` | `--tecton-space-800` | `spacing['800']` |
| `space.900` | Extra-large page spacing. | 72px | `foundational.scale.space.900` | `--tecton-space-900` | `spacing['900']` |
| `space.1000` | Major page region separation. | 80px | `foundational.scale.space.1000` | `--tecton-space-1000` | `spacing['1000']` |
| `space.1200` | Large empty-space rhythm for full-page layou… | 96px | `foundational.scale.space.1200` | `--tecton-space-1200` | `spacing['1200']` |
| `space.1400` | Extra-large region separation. | 112px | `foundational.scale.space.1400` | `--tecton-space-1400` | `spacing['1400']` |
| `space.1600` | Display-scale page spacing. | 128px | `foundational.scale.space.1600` | `--tecton-space-1600` | `spacing['1600']` |
| `space.1800` | Maximum documented layout spacing. | 144px | `foundational.scale.space.1800` | `--tecton-space-1800` | `spacing['1800']` |

_20 spacing tokens._

## Corner Radii

Radius tokens define the corner shape for controls, cards, grouped surfaces, pills, and circular treatments.

| Token | Description | Value | Source token | CSS variable | TypeScript token |
| --- | --- | --- | --- | --- | --- |
| `radius.0` | Square edges and flush seams. | 0px | `foundational.scale.borderRadius.0` | `--tecton-radius-0` | `borderRadius['0']` |
| `radius.25` | Subtle rounding for dense controls. | 2px | `foundational.scale.borderRadius.25` | `--tecton-radius-25` | `borderRadius['25']` |
| `radius.50` | Default Tecton corner radius. | 4px | `foundational.scale.borderRadius.50` | `--tecton-radius-50` | `borderRadius['50']` |
| `radius.100` | Medium rounded surfaces and grouped contro… | 8px | `foundational.scale.borderRadius.100` | `--tecton-radius-100` | `borderRadius['100']` |
| `radius.150` | Large rounded surfaces. | 12px | `foundational.scale.borderRadius.150` | `--tecton-radius-150` | `borderRadius['150']` |
| `radius.200` | Extra-large rounded surfaces. | 16px | `foundational.scale.borderRadius.200` | `--tecton-radius-200` | `borderRadius['200']` |
| `radius.round` | Fully rounded pills and circular shapes. | 1000px | `foundational.scale.borderRadius.round` | `--tecton-radius-round` | `borderRadius.round` |

_7 radius tokens._

The page also renders a **Preview** column (a bar sized to the spacing value, or a rounded rectangle for radii); it carries no additional data and is not reproduced here.
