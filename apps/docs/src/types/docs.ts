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
    anatomy?: readonly DocAnatomyPart[];
  };
  props?: readonly DocProp[];
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
