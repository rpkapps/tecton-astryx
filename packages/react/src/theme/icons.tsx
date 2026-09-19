/**
 * Tecton icon registry.
 *
 * Semantic icon names mapped to inline SVG elements. The registry lives in its
 * own module (and is imported by name from `tectonTheme.ts`) because the theme
 * compiler emits a sidecar import for the registry rather than inlining it.
 * The module is compiled to `dist/theme/icons.js`, which is exactly where the
 * generated built theme imports it from.
 */
import type {ReactNode} from 'react';
import type {IconRegistry} from '@astryxdesign/core/Icon';

/** Semantic icon names Tecton components resolve through the active theme. */
export type TectonIconRegistry = Partial<IconRegistry>;

const svgProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

const close: ReactNode = (
  <svg {...svgProps}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const check: ReactNode = (
  <svg {...svgProps}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const chevronDown: ReactNode = (
  <svg {...svgProps}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** The icon set Tecton ships with its theme. */
export const tectonIcons: TectonIconRegistry = {
  close,
  check,
  chevronDown,
};
