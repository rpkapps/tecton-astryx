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

export interface ComponentDoc {
  name: string;
  displayName: string;
  group?: string;
  category?: string;
  keywords?: readonly string[];
  usage: {
    description: string;
    bestPractices?: readonly DocGuidance[];
    /** How the component behaves for assistive technology. */
    accessibility?: string;
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
}

export interface DocProseBlock {
  type: 'prose';
  text: string;
}

export interface DocSection {
  title: string;
  content: readonly DocProseBlock[];
}

export interface DocTopic {
  type: 'generic';
  name: string;
  title: string;
  description: string;
  sections: readonly DocSection[];
}
