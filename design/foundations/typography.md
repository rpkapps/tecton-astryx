# Typography

> Transcribed verbatim from `screenshots/116_foundations-typography__overview.png`.

Use Tecton typography tokens to keep hierarchy, density, and data readouts consistent across screens. TectonText applies Figtree for interface and data text, with IBM Plex Mono reserved for code and progress labels.

| Guidance | Detail |
| --- | --- |
| Hierarchy | Display and heading styles establish page structure and section rhythm. |
| Interface Text | Large, medium, small, and tiny styles cover body copy, labels, and dense metadata. |
| Data Text | Data variants use tabular numbers so measurements and table values align cleanly. |

## Usage

Use the TectonText wrapper for product UI text. Reach for theme typography tokens only when building component internals or MUI theme overrides.

| Card | Guidance | Example |
| --- | --- | --- |
| Product text | Render headings, labels, body copy, and metadata with TectonText variants that match the Figma text style names. | `<TectonText variant="heading1">Framework Model</TectonText>` |
| Data text | Use data variants for numeric values that need tabular number alignment in tables, metrics, and dense panels. | `<TectonText variant="mediumData">32.45% / 1,280 ft</TectonText>` |
| Action text | Buttons and controls apply action styles internally; use action variants only for custom action-like text. | `<TectonText variant="actionSmall">Apply filter</TectonText>` |

The page prints each variant as Family / Size / Weight / Line height. The px columns below are derived from the rem size at a 16px root; they are not printed on the page.

## Displays and Headings

Large text styles for page titles, documentation titles, and major section breaks.

| Token | Usage | Family | Size (rem) | Size (px, derived) | Weight | Line height | Line height (px, derived) | Sample |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `display1` | Largest editorial display text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 3rem | 48px | 500 | 1.2083333333333333 | 58px | Display 1 |
| `display2` | Large page-level display text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 2.5rem | 40px | 500 | 1.2 | 48px | Display 2 |
| `display3` | Overview page titles and compact display headings. | `"Figtree", "Helvetica", "Arial", sans-serif` | 2rem | 32px | 500 | 1.1875 | 38px | Display 3 |
| `heading1` | Major section headings. | `"Figtree", "Helvetica", "Arial", sans-serif` | 1.5rem | 24px | 500 | 1.25 | 30px | Heading 1 |
| `heading2` | Section headings inside documentation pages. | `"Figtree", "Helvetica", "Arial", sans-serif` | 1.25rem | 20px | 500 | 1.2 | 24px | Heading 2 |

## Text

Core reading styles for body copy, labels, supporting descriptions, and dense metadata.

| Token | Usage | Family | Size (rem) | Size (px, derived) | Weight | Line height | Line height (px, derived) | Sample |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `large` | Lead copy and prominent supporting text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 1rem | 16px | 500 | 1.25 | 20px | Large text |
| `medium` | Default body text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.875rem | 14px | 400 | 1.2857142857142858 | 18px | Medium text |
| `mediumStrong` | Table headers and emphasized body labels. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.875rem | 14px | 500 | 1.2857142857142858 | 18px | Medium strong |
| `small` | Supporting descriptions and compact metadata. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.75rem | 12px | 400 | 1.3333333333333333 | 16px | Small text |
| `smallStrong` | Compact labels and matrix headers. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.75rem | 12px | 500 | 1.3333333333333333 | 16px | Small strong |
| `tiny` | Small metadata and dense labels. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.625rem | 10px | 500 | 1.4 | 14px | Tiny text |

## Data

Numeric readouts use Figtree with tabular numbers for alignment in tables and panels.

| Token | Usage | Family | Size (rem) | Size (px, derived) | Weight | Line height | Line height (px, derived) | Sample |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `largeData` | Large numeric values and data readouts. | `"IBM Plex Mono", "Consolas", "Monaco", monospace` | 1rem | 16px | 400 | 1.25 | 20px | 1,248.75 bbl |
| `mediumData` | Default numeric values in tables and panels. | `"IBM Plex Mono", "Consolas", "Monaco", monospace` | 0.875rem | 14px | 400 | 1.2857142857142858 | 18px | 32.45% / 1,280 ft |
| `smallData` | Compact numeric metadata. | `"IBM Plex Mono", "Consolas", "Monaco", monospace` | 0.75rem | 12px | 400 | 1.3333333333333333 | 16px | 0.0037 sec |

## Actions

Button and control labels use action-specific styles for consistent weight and rhythm.

| Token | Usage | Family | Size (rem) | Size (px, derived) | Weight | Line height | Line height (px, derived) | Sample |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `actionMedium` | Medium button/action text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.875rem | 14px | 500 | 1.2857142857142858 | 18px | Action medium |
| `actionSmall` | Small button/action text. | `"Figtree", "Helvetica", "Arial", sans-serif` | 0.75rem | 12px | 500 | 1.3333333333333333 | 16px | Action small |

## Note recorded from the page

The Data section heading says "Numeric readouts use Figtree with tabular numbers for alignment in tables and panels", but the CSS printed for `largeData`, `mediumData` and `smallData` lists `"IBM Plex Mono", "Consolas", "Monaco", monospace`. Both statements are transcribed as shown; the inconsistency is on the page.
