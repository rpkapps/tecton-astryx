import defaultMdxComponents from 'fumadocs-ui/mdx';
import type {MDXComponents} from 'mdx/types';
import {ExampleBlock} from '@/components/component-detail/ExampleBlock';
import {
  AccessibilitySection,
  AnatomyTable,
  BestPractices,
  CodeCaption,
  HookSignatureSection,
  PartTable,
  Playground,
  Practice,
  PropsTable,
  Related,
  Theming,
} from '@/components/docs/component-page';
import {ComponentGallery} from '@/components/docs/gallery';
import {DocsIndex} from '@/components/docs/docs-index';
import {TemplateGallery, TemplatePreview} from '@/components/docs/templates';
import {Foundation} from '@/components/docs/foundations';
import {Changelog} from '@/components/docs/changelog';

/**
 * What the generated MDX is allowed to reach for.
 *
 * Every page under `content/docs` is written by the generator and none of them
 * import anything: the components below are in scope for all of them, which is
 * what keeps a generated page a description of its data rather than a program.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accessibility: AccessibilitySection,
    AnatomyTable,
    BestPractices,
    Changelog,
    CodeCaption,
    ComponentGallery,
    DocsIndex,
    ExampleBlock,
    Foundation,
    HookSignature: HookSignatureSection,
    PartTable,
    Playground,
    Practice,
    PropsTable,
    Related,
    TemplateGallery,
    TemplatePreview,
    Theming,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
