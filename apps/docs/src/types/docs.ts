/** Shapes of the documentation data the site renders. */

export interface DocGuidance {
  /** True for "do this", false for "avoid this". */
  guidance: boolean;
  description: string;
}

export interface DocAnatomyPart {
  name: string;
  required?: boolean;
  description: string;
}

export interface DocProp {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}

/** One row of a component's accessibility table. */
export interface DocAccessibilityRow {
  /** What the row is about — "Keyboard", "Screen reader", "Focus". */
  topic: string;
  /** What Tecton does about it. */
  description: string;
}

export interface ComponentDoc {
  name: string;
  displayName: string;
  group?: string;
  category?: string;
  keywords?: readonly string[];
  usage: {
    description: string;
    bestPractices?: readonly DocGuidance[];
    /**
     * How the component behaves for assistive technology: a paragraph, or the
     * rows of an accessibility table.
     */
    accessibility?: string | readonly DocAccessibilityRow[];
    anatomy?: readonly DocAnatomyPart[];
  };
  props?: readonly DocProp[];
  /** Ids of the examples that belong to this component. */
  examples?: readonly string[];
  /**
   * The exported type the props table describes, when it is not
   * `<name>Props` — a hook documents its payload instead.
   */
  propsType?: string;
  /** Where Tecton's design and what the component can express disagree. */
  notes?: readonly string[];
  /** Custom properties a consumer may set to restyle the component. */
  theming?: readonly DocThemingTarget[];
  /** Components worth reading next. */
  related?: readonly string[];
}

/** One custom property a consumer can set to restyle a component. */
export interface DocThemingTarget {
  token: string;
  description: string;
}

/** One runnable example, authored beside the component it demonstrates. */
export interface ExampleDoc {
  /** Matches the file name, and the ids a component doc lists. */
  id: string;
  /** What the example is called in the documentation. */
  name: string;
  /** The component the example belongs to. */
  component: string;
  description: string;
  /**
   * Where the example lives, relative to `packages/react/src`. Filled in by
   * `scripts/generate-data.mjs`; the authored file does not carry it.
   */
  path?: string;
  /**
   * The source, with its imports rewritten to what a consumer would write.
   * Filled in by the generator from the example's own file.
   */
  code?: string;
}

/** One page template, published from `@tecton/react/templates`. */
export interface TemplateDoc {
  /** The exported component's name, and the id the loader map is keyed by. */
  id: string;
  name: string;
  displayName?: string;
  description: string;
  category?: string;
  /** Where it lives, relative to `packages/react/src`. */
  path?: string;
  /** The source, with its imports rewritten the way a consumer writes them. */
  code?: string;
}

/* -------------------------------------------------------------------------- */
/* Written topics                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A paragraph. `text` may carry inline code in backticks and a link written as
 * `[label](/path)`; nothing else is markup.
 */
export interface DocProseBlock {
  type: 'prose';
  text: string;
}

export interface DocCodeBlock {
  type: 'code';
  /** For the tokenizer: `tsx`, `ts`, `css`, `html`, `bash` or `text`. */
  language?: 'tsx' | 'ts' | 'css' | 'html' | 'bash' | 'text';
  code: string;
  /** A line above the block saying what it is. */
  caption?: string;
}

export interface DocTableBlock {
  type: 'table';
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  caption?: string;
}

export interface DocListBlock {
  type: 'list';
  ordered?: boolean;
  items: readonly string[];
}

export type DocBlock =
  | DocProseBlock
  | DocCodeBlock
  | DocTableBlock
  | DocListBlock;

export interface DocSection {
  title: string;
  content: readonly DocBlock[];
}

export interface DocTopic {
  type: 'generic';
  name: string;
  title: string;
  description: string;
  /** Which side-nav group the topic belongs to. */
  category?: string;
  sections: readonly DocSection[];
}

/* -------------------------------------------------------------------------- */
/* Foundations, printed from the package's own tokens                         */
/* -------------------------------------------------------------------------- */

/** One token of the `tecton` map: where it lives and what it resolves to. */
export interface TokenRow {
  /** Its path in the `tecton` map, without the group — `text.primary`. */
  path: string;
  /** The CSS custom property the map points at. */
  token: string;
  /** What the built stylesheet declares the property to be. */
  value?: string;
  /** The light and dark halves of a `light-dark()` value. */
  light?: string;
  dark?: string;
  /** What the design foundation says the role is for. */
  description?: string;
  /** The design's own name for the same step, when there is one. */
  designToken?: string;
}

/** One colour role, with the value it takes in each mode. */
export interface PaletteRow {
  path: string;
  light: string;
  dark: string;
  description?: string;
}

export interface PaletteGroup {
  name: string;
  title: string;
  rows: readonly PaletteRow[];
}

export interface TypeRow {
  name: string;
  size: string;
  sizePx: string;
  weight: string;
  leading: string;
  isData: boolean;
  section: string;
  description?: string;
  sample: string;
}

export interface FoundationData {
  paletteGroups: readonly PaletteGroup[];
  paletteDescribed: number;
  paletteTotal: number;
  colourTokens: readonly TokenRow[];
  typeRows: readonly TypeRow[];
  fontFamilies: readonly TokenRow[];
  spacingRows: readonly TokenRow[];
  radiusRows: readonly TokenRow[];
  sizeRows: readonly TokenRow[];
  borderRows: readonly TokenRow[];
  shadowRows: readonly TokenRow[];
  motionRows: readonly TokenRow[];
  iconNames: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* The changelog                                                              */
/* -------------------------------------------------------------------------- */

export interface ChangelogSection {
  title: string;
  items: readonly string[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  sections: readonly ChangelogSection[];
}

/** One foundations page, and the files it is printed from. */
export interface FoundationPage {
  name: string;
  title: string;
  sources: readonly string[];
}

/** Every route the generator wrote a page for. */
export interface SitePage {
  /** The site path, e.g. `/docs/components/Button`. */
  url: string;
  /** What the page is called. */
  title: string;
  /** Which part of the site it belongs to. */
  kind: 'guide' | 'foundation' | 'component' | 'template' | 'index' | 'changelog';
}
