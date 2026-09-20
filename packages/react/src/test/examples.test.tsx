/**
 * Every documented example renders.
 *
 * The examples are what the documentation site shows and what a reader copies,
 * so they are code, not prose: this test imports every one of them and renders
 * it inside a Tecton application. Anything that throws — a missing prop, a
 * renamed variant, a glyph that no longer exists — fails here rather than on
 * the site.
 */
import {describe, expect, it} from 'vitest';
import type {ComponentType} from 'react';
import {render} from '@testing-library/react';
import {TectonProvider} from '../provider/TectonProvider.js';

const modules = import.meta.glob<Record<string, unknown>>(
  '../components/*/examples/*.tsx',
  {eager: true},
);

const templateModules = import.meta.glob<Record<string, unknown>>(
  '../templates/*/Template.tsx',
  {eager: true},
);

function componentsIn(modules: Record<string, Record<string, unknown>>) {
  return Object.entries(modules).flatMap(([file, module]) =>
    Object.entries(module)
      .filter(
        (entry): entry is [string, ComponentType] =>
          typeof entry[1] === 'function',
      )
      .map(([name, Example]) => ({
        file,
        name: name === 'Template' ? `${file.split('/').at(-2)} template` : name,
        Example,
      })),
  );
}

const examples = componentsIn(modules);
const templates = componentsIn(templateModules);

describe('the documented examples', () => {
  it('are all picked up', () => {
    expect(examples.length).toBeGreaterThanOrEqual(400);
  });

  it.each(examples.map(example => [example.name, example] as const))(
    '%s renders inside a Tecton application',
    (_name, {Example}) => {
      expect(() =>
        render(
          <TectonProvider>
            <Example />
          </TectonProvider>,
        ),
      ).not.toThrow();
    },
  );
});

describe('the page templates', () => {
  it('are all picked up', () => {
    expect(templates.length).toBeGreaterThanOrEqual(1);
  });

  it.each(templates.map(template => [template.name, template] as const))(
    '%s renders inside a Tecton application',
    (_name, {Example}) => {
      expect(() =>
        render(
          <TectonProvider>
            <Example />
          </TectonProvider>,
        ),
      ).not.toThrow();
    },
  );
});
