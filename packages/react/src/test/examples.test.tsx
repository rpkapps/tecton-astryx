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

const examples = Object.entries(modules).flatMap(([file, module]) =>
  Object.entries(module)
    .filter(
      (entry): entry is [string, ComponentType] =>
        typeof entry[1] === 'function',
    )
    .map(([name, Example]) => ({file, name, Example})),
);

describe('the documented examples', () => {
  it('are all picked up', () => {
    expect(examples.length).toBeGreaterThanOrEqual(60);
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
