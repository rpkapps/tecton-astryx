import defaultMdxComponents from 'fumadocs-ui/mdx';
import type {MDXComponents} from 'mdx/types';
import {ExampleFrame} from '@/components/docs/example-frame';
import {
  AccessibilityTable,
  AnatomyTable,
  CodeCaption,
  ComponentHeader,
  Guidance,
  PropsTable,
  RelatedComponents,
  ThemingTable,
} from '@/components/docs/component-bits';
import {
  ComponentGallery,
  DocsIndex,
  TemplateGallery,
  TemplatePreview,
} from '@/components/docs/gallery';
import {Foundation} from '@/components/docs/foundations';
import {Changelog} from '@/components/docs/changelog';

/**
 * What the generated MDX is allowed to reach for.
 *
 * Every page under `content/docs` is written by the generator, and none of them
 * import anything: the components below are in scope for all of them, which is
 * what keeps a generated page a description of its data rather than a program.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AccessibilityTable,
    AnatomyTable,
    Changelog,
    CodeCaption,
    ComponentGallery,
    ComponentHeader,
    DocsIndex,
    ExampleFrame,
    Foundation,
    Guidance,
    PropsTable,
    RelatedComponents,
    TemplateGallery,
    TemplatePreview,
    ThemingTable,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
