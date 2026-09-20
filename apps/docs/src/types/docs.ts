/**
 * The shape of everything the generator writes.
 *
 * `scripts/generate-data.mjs` prints JSON into `src/generated/**`; this file is
 * the hand-written contract it is typed against, so a change to the doc objects
 * upstream shows up as a type error here rather than as an empty table on a
 * page. The component shapes mirror the upstream `.doc.mjs` authoring types
 * one for one — only the strings have been rewritten to say Tecton.
 */

/* -------------------------------------------------------------------------- */
/* Component docs                                                             */
/* -------------------------------------------------------------------------- */

/** A React element a doc describes as data, so a preview can build it. */
export interface ElementDescriptor {
  __element: string;
  props?: Record<string, unknown>;
  children?: unknown;
}

export interface DocProp {
  name: string;
  type: string;
  description?: string;
  default?: string;
  required?: boolean;
  /** Elements this prop accepts, for the playground's slot controls. */
  slotElements?: ElementDescriptor[];
}

/** A hook parameter is documented exactly as a prop is. */
export type HookParamDoc = DocProp;

export interface HookReturnDoc {
  name: string;
  type: string;
  description?: string;
}

export interface BestPractice {
  guidance: boolean;
  description: string;
}

export interface AccessibilityRequirement {
  name: string;
  description: string;
  category?: string;
  criterion?: string;
  requirement?: string;
  states?: string[];
}

export interface AnatomyElement {
  name: string;
  description: string;
  required?: boolean;
}

export interface UsageDoc {
  description?: string;
  bestPractices?: BestPractice[];
  accessibility?: AccessibilityRequirement[];
  anatomy?: AnatomyElement[];
}

export interface ThemingTarget {
  /** The stable class name the component carries, e.g. `astryx-button`. */
  className: string;
  visualProps?: string[];
  states?: string[];
  deprecatedFor?: string;
}

export interface ComponentVar {
  name: string;
  description?: string;
  default?: string;
  private?: boolean;
  derived?: boolean;
  formula?: string;
}

export interface ThemingDoc {
  /** Whether the component is a container other components are themed inside. */
  container?: boolean;
  targets: ThemingTarget[];
  vars?: ComponentVar[];
  /**
   * Properties the component computes from its own variables. A row may also
   * say how (`expand`, `replaces`), which the tables do not print but which is
   * carried through so the data stays the doc's.
   */
  derived?: Array<{
    property: string;
    vars?: string[];
    expand?: unknown;
    replaces?: unknown;
  }>;
}

export interface PlaygroundConfig {
  defaults?: Record<string, unknown>;
  /** A parent the previewed component needs around it to render at all. */
  wrapper?: {
    component: string;
    props?: Record<string, unknown>;
    slotProp?: string;
  };
  /** The component renders nothing inline until it is opened. */
  overlay?: boolean;
  overlayControl?: {stateProp: string; openValue: unknown};
}

/** A component a module is made of, documented on the module's page. */
export interface SubComponentEntry {
  name: string;
  displayName: string;
  description: string;
  props: DocProp[];
  params?: HookParamDoc[] | null;
  returns?: HookReturnDoc[] | null;
  isHook: boolean;
}

/** One page: one upstream module doc. */
export interface ComponentEntry {
  name: string;
  displayName: string;
  /** The directory the doc lives in, which is also the export subpath. */
  module: string;
  /** The name a consumer imports. */
  moduleName: string;
  /** The entry point they import it from. */
  importPath: string;
  group: string | null;
  category: string | null;
  keywords: string[];
  /** The long description, from `usage.description`. */
  description: string;
  /** The one-line summary, from `description`. */
  summary: string;
  usage: UsageDoc | null;
  props: DocProp[];
  playground: PlaygroundConfig | null;
  theming: ThemingDoc | null;
  params: HookParamDoc[] | null;
  returns: HookReturnDoc[] | null;
  relatedComponents: string[] | null;
  relatedHooks: string[] | null;
  isHook: boolean;
  isHiddenFromOverview: boolean;
  parentDoc: string | null;
  subcomponents: SubComponentEntry[];
  /** The ids of the examples this page renders, in file order. */
  examples: string[];
  /** The example that leads the page, if one is marked as the showcase. */
  showcase: string | null;
}

/* -------------------------------------------------------------------------- */
/* Examples and templates                                                     */
/* -------------------------------------------------------------------------- */

export interface ExampleEntry {
  id: string;
  /** The directory upstream filed it under. */
  dir: string;
  /** The page that renders it. */
  page: string;
  /** The component it is an example of, which may be a part of that page. */
  exampleFor: string;
  name: string;
  displayName: string;
  description: string;
  componentsUsed: string[];
  aspectRatio: number | null;
  scale: number | null;
  isShowcase: boolean;
  /** The file, verbatim — the same text the module is compiled from. */
  source: string;
}

export interface TemplateEntry {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  isHiddenFromOverview: boolean;
  source: string;
}

/* -------------------------------------------------------------------------- */
/* The sidebar                                                                */
/* -------------------------------------------------------------------------- */

export interface SidebarEntry {
  type: 'entry';
  name: string;
  displayName: string;
  href: string;
  description?: string;
}

export interface SidebarGroup {
  type: 'group';
  /** The raw group label from the docs, which is also its identity. */
  label: string;
  displayName: string;
  description: string;
  entries: Array<{name: string; displayName: string; href: string}>;
}

export type SidebarItem = SidebarEntry | SidebarGroup;

export interface SidebarData {
  items: SidebarItem[];
  utilities: Array<{
    name: string;
    displayName: string;
    href: string;
    description?: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Guides                                                                     */
/* -------------------------------------------------------------------------- */

export interface ProseBlock {
  type: 'prose';
  text: string;
}
export interface CodeBlock {
  type: 'code';
  code: string;
  language?: string;
  caption?: string;
}
export interface ListBlock {
  type: 'list';
  items: string[];
  ordered?: boolean;
}
export interface TableBlock {
  type: 'table';
  columns: string[];
  rows: string[][];
  caption?: string;
}
export type DocBlock = ProseBlock | CodeBlock | ListBlock | TableBlock;

export interface DocSection {
  title: string;
  content: DocBlock[];
}

export interface DocTopic {
  /** What kind of doc file this is; the guides all declare `'generic'`. */
  type?: string;
  name: string;
  title: string;
  description: string;
  /** The sidebar section a guide belongs to. */
  category?: string;
  sections: DocSection[];
}

/* -------------------------------------------------------------------------- */
/* Foundations, changelog, routes                                             */
/* -------------------------------------------------------------------------- */

export interface TokenRow {
  path: string;
  token: string;
  value?: string;
  light?: string;
  dark?: string;
  designToken?: string;
  description?: string;
}

export interface PaletteRow {
  path: string;
  light: string;
  dark: string;
  description?: string;
}

export interface PaletteGroup {
  name: string;
  title: string;
  rows: PaletteRow[];
}

export interface TypeRow {
  name: string;
  size: string;
  sizePx: string;
  weight: string | number;
  leading: string;
  isData: boolean;
  section: string;
  description?: string;
  sample: string;
}

export interface FoundationData {
  paletteGroups: PaletteGroup[];
  paletteDescribed: number;
  paletteTotal: number;
  colourTokens: TokenRow[];
  typeRows: TypeRow[];
  fontFamilies: TokenRow[];
  spacingRows: TokenRow[];
  radiusRows: TokenRow[];
  sizeRows: TokenRow[];
  borderRows: TokenRow[];
  shadowRows: TokenRow[];
  motionRows: TokenRow[];
  iconNames: string[];
}

export interface FoundationPage {
  name: string;
  title: string;
  sources: string[];
}

export interface ChangelogSection {
  title: string;
  items: string[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  sections: ChangelogSection[];
}

export interface SitePage {
  url: string;
  title: string;
  kind: string;
}
