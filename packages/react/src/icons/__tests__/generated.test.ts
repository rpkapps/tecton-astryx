/**
 * The generated icon set, checked against the design delivery.
 *
 * `scripts/generate-icons.mjs --check` is the drift guard and runs in the
 * build; these tests are about the *shape* of what it produced — that every
 * delivered glyph arrived, that the Figma-only markup was stripped on the way,
 * and that the one coloured glyph carries a real gradient rather than the HTML
 * hack the export wrapped it in.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {tectonIconNames} from '../names.js';
import {tectonIconRegistry} from '../registry.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GENERATED = path.resolve(HERE, '..', 'generated');
const DELIVERY = path.resolve(
  HERE,
  '..',
  '..',
  '..',
  '..',
  '..',
  'design',
  'icons',
  'tecton',
);

const files = fs
  .readdirSync(GENERATED)
  .filter(name => name.endsWith('.tsx'))
  .sort();

describe('the generated icon set', () => {
  it('has one component per delivered glyph', () => {
    const delivered = fs
      .readdirSync(DELIVERY)
      .filter(name => name.endsWith('.ts'))
      .map(name => name.replace(/\.ts$/, ''))
      .sort();

    expect(delivered).toHaveLength(131);
    expect(tectonIconNames).toHaveLength(131);
    expect([...tectonIconNames].sort()).toEqual(delivered);
    expect(files).toHaveLength(131);
  });

  it('registers every name', () => {
    for (const name of tectonIconNames) {
      expect(tectonIconRegistry[name], name).toBeTypeOf('function');
    }
    expect(Object.keys(tectonIconRegistry)).toHaveLength(131);
  });

  it('names glyphs in kebab-case, as the design delivers them', () => {
    for (const name of tectonIconNames) {
      expect(name, name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(tectonIconNames).toContain('drill-bit');
    expect(tectonIconNames).toContain('well-pick');
  });

  it('carries no Figma-only markup anywhere', () => {
    for (const file of files) {
      const source = fs.readFileSync(path.join(GENERATED, file), 'utf8');
      expect(source, file).not.toContain('foreignObject');
      expect(source, file).not.toContain('data-figma');
      expect(source, file).not.toContain('conic-gradient');
      expect(source, file).not.toContain('xmlns:xhtml');
    }
  });

  it('paints every glyph but strata in currentColor', () => {
    for (const file of files) {
      const source = fs.readFileSync(path.join(GENERATED, file), 'utf8');
      expect(source, file).toContain('fill="currentColor"');
      if (file !== 'strata.tsx') {
        expect(source.match(/fill=/g) ?? [], file).toHaveLength(1);
      }
    }
  });

  it('re-draws strata with a real SVG gradient across the three stops', () => {
    const source = fs.readFileSync(path.join(GENERATED, 'strata.tsx'), 'utf8');

    expect(source).toContain('<linearGradient');
    expect(source).toContain('#9957BE');
    expect(source).toContain('#C8102E');
    expect(source).toContain('#F68F1F');
    expect(source).toContain('url(#${gradientId})');
    // The gradient id is derived per instance, so two strata on one page do not
    // fight over the same paint server.
    expect(source).toContain('useId()');
  });

  it('is the only coloured glyph in the set', () => {
    const coloured = files.filter(file =>
      fs
        .readFileSync(path.join(GENERATED, file), 'utf8')
        .includes('linearGradient'),
    );

    expect(coloured).toEqual(['strata.tsx']);
  });
});
