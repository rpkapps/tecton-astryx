/**
 * Tecton typography.
 *
 * Two families — Figtree for everything the interface says, IBM Plex Mono for
 * everything it measures — and a 16-variant type scale transcribed from the
 * typography foundation. The scale is *not* geometric, so it is written out as
 * explicit tokens rather than generated from a base and a ratio: Tecton jumps
 * 10 → 12 → 14 → 16 → 20 → 24 → 32 → 40 → 48 px and stops at two weights.
 *
 * Fonts are the host application's job to load; the theme only names them.
 */

/** The sixteen Tecton text variants, as the foundation prints them. */
export interface TectonTextVariant {
  /** `font-size`, in rem, exactly as the foundation prints it. */
  readonly size: string;
  /** `font-weight` — Tecton uses 400 and 500 only. */
  readonly weight: string;
  /** Unitless `line-height`. */
  readonly leading: string;
  /** True for the three data variants, which are monospace with lining figures. */
  readonly data?: boolean;
}

/** Raw font-size tokens. Tecton's ladder, not the default geometric one. */
export const fontSizes = {
  '--font-size-xs': '0.625rem', // 10px — tiny
  '--font-size-sm': '0.75rem', // 12px — small
  '--font-size-base': '0.875rem', // 14px — medium (body)
  '--font-size-lg': '1rem', // 16px — large
  '--font-size-xl': '1.25rem', // 20px — heading2
  '--font-size-2xl': '1.5rem', // 24px — heading1
  '--font-size-3xl': '2rem', // 32px — display3
  '--font-size-4xl': '2.5rem', // 40px — display2
  '--font-size-5xl': '3rem', // 48px — display1
} as const;

/**
 * Weight tokens. Tecton's foundation has two weights, 400 and 500. `semibold`
 * therefore resolves to 500 — there is no 600 in the design — and `bold` is set
 * to 600 so that prose `<strong>` still has somewhere to go.
 */
export const fontWeights = {
  '--font-weight-normal': '400',
  '--font-weight-medium': '500',
  '--font-weight-semibold': '500',
  '--font-weight-bold': '600',
} as const;

/** The transcribed variants, keyed by the name the foundation gives them. */
export const variants = {
  display1: {size: '3rem', weight: '500', leading: '1.2083333333333333'},
  display2: {size: '2.5rem', weight: '500', leading: '1.2'},
  display3: {size: '2rem', weight: '500', leading: '1.1875'},
  heading1: {size: '1.5rem', weight: '500', leading: '1.25'},
  heading2: {size: '1.25rem', weight: '500', leading: '1.2'},
  large: {size: '1rem', weight: '500', leading: '1.25'},
  medium: {size: '0.875rem', weight: '400', leading: '1.2857142857142858'},
  mediumStrong: {
    size: '0.875rem',
    weight: '500',
    leading: '1.2857142857142858',
  },
  small: {size: '0.75rem', weight: '400', leading: '1.3333333333333333'},
  smallStrong: {size: '0.75rem', weight: '500', leading: '1.3333333333333333'},
  tiny: {size: '0.625rem', weight: '500', leading: '1.4'},
  largeData: {size: '1rem', weight: '400', leading: '1.25', data: true},
  mediumData: {
    size: '0.875rem',
    weight: '400',
    leading: '1.2857142857142858',
    data: true,
  },
  smallData: {
    size: '0.75rem',
    weight: '400',
    leading: '1.3333333333333333',
    data: true,
  },
  actionMedium: {
    size: '0.875rem',
    weight: '500',
    leading: '1.2857142857142858',
  },
  actionSmall: {size: '0.75rem', weight: '500', leading: '1.3333333333333333'},
} as const satisfies Record<string, TectonTextVariant>;

export type TectonVariantName = keyof typeof variants;

/** The raw size token a variant's rem value corresponds to. */
const SIZE_TOKEN: Record<string, string> = {
  '0.625rem': 'var(--font-size-xs)',
  '0.75rem': 'var(--font-size-sm)',
  '0.875rem': 'var(--font-size-base)',
  '1rem': 'var(--font-size-lg)',
  '1.25rem': 'var(--font-size-xl)',
  '1.5rem': 'var(--font-size-2xl)',
  '2rem': 'var(--font-size-3xl)',
  '2.5rem': 'var(--font-size-4xl)',
  '3rem': 'var(--font-size-5xl)',
};

const WEIGHT_TOKEN: Record<string, string> = {
  '400': 'var(--font-weight-normal)',
  '500': 'var(--font-weight-medium)',
};

/**
 * Turn a Tecton variant into the three `--text-<role>-*` tokens Astryx reads.
 *
 * Sizes and weights are emitted as references to the raw tokens above, so a
 * consumer that re-points `--font-size-base` moves the whole scale with it.
 */
export function typeScaleTokensFor(
  role: string,
  variant: TectonTextVariant,
): Record<string, string> {
  return {
    [`--text-${role}-size`]: SIZE_TOKEN[variant.size] ?? variant.size,
    [`--text-${role}-weight`]: WEIGHT_TOKEN[variant.weight] ?? variant.weight,
    [`--text-${role}-leading`]: variant.leading,
  };
}

/**
 * Which Tecton variant each built-in Astryx type-scale role is set from.
 *
 * Astryx names six heading levels, Tecton names two. Levels 3–6 continue the
 * ladder with the interface variants that sit at those sizes, which is what the
 * component screenshots actually use for sub-headings.
 */
export const typeScaleMapping = {
  'heading-1': 'heading1',
  'heading-2': 'heading2',
  'heading-3': 'large',
  'heading-4': 'mediumStrong',
  'heading-5': 'smallStrong',
  'heading-6': 'tiny',
  body: 'medium',
  large: 'large',
  label: 'mediumStrong',
  code: 'mediumData',
  supporting: 'small',
  'display-1': 'display1',
  'display-2': 'display2',
  'display-3': 'display3',
} as const satisfies Record<string, TectonVariantName>;

/** The full set of `--text-*` token overrides. */
export const typeScaleTokens: Record<string, string> = Object.fromEntries(
  Object.entries(typeScaleMapping).flatMap(([role, variant]) =>
    Object.entries(typeScaleTokensFor(role, variants[variant])),
  ),
);

/**
 * Tecton variants that no built-in `Text type` covers, exposed as custom types.
 *
 * `astryx theme build` turns each of these into a module augmentation, so
 * `<Text type="mediumData">` type-checks once the theme is built.
 */
export const customTextTypes = [
  'mediumStrong',
  'smallStrong',
  'tiny',
  'largeData',
  'mediumData',
  'smallData',
  'actionMedium',
  'actionSmall',
] as const satisfies readonly TectonVariantName[];

/** Style block for one custom `Text` type. */
export function customTextTypeStyle(
  variant: TectonTextVariant,
): Record<string, string> {
  const style: Record<string, string> = {
    fontSize: SIZE_TOKEN[variant.size] ?? variant.size,
    fontWeight: WEIGHT_TOKEN[variant.weight] ?? variant.weight,
    lineHeight: variant.leading,
  };
  if (variant.data) {
    style.fontFamily = 'var(--font-family-code)';
    style.fontVariantNumeric = 'tabular-nums';
  } else {
    style.fontFamily = 'var(--font-family-body)';
  }
  return style;
}

/** The `components.text` entries that declare the custom types. */
export const customTextTypeStyles: Record<
  string,
  Record<string, string>
> = Object.fromEntries(
  customTextTypes.map(name => [
    `type:${name}`,
    customTextTypeStyle(variants[name]),
  ]),
);
