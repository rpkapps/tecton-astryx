/**
 * Test-only readers for the design sources.
 *
 * The point of these tests is to check the theme against the *design*, not
 * against a second copy of the theme, so nothing here imports from
 * `src/theme/`. Values come from `design/foundations/colors.json` (the
 * transcribed colour page) and `tokens/tecton.tokens.json` (the foundational
 * export), and the light-mode derivation is re-implemented from the rule rather
 * than reused from `semantic.ts`.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..');

const read = (relative: string) =>
  JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relative), 'utf8'));

/** One row of the transcribed Tecton colour page. */
export interface ColorRow {
  section: string;
  name: string;
  dark: string;
  light: string | null;
  notes: string | null;
}

const rows: ColorRow[] = Object.values(
  read('design/foundations/colors.json') as Record<string, ColorRow>,
);

/** Every transcribed colour row, keyed by the name the page prints. */
export const colorRows = rows;

/**
 * Look up a row by the name the colour page prints for it.
 *
 * Several Component Tokens rows share a truncated name; those are addressed by
 * name *and* value, which is how the transcription keeps them distinguishable.
 */
export function row(name: string, value?: string): ColorRow {
  const matches = rows.filter(
    entry =>
      entry.name === name && (value === undefined || entry.dark === value),
  );
  if (matches.length === 0) {
    throw new Error(`design/foundations/colors.json has no row "${name}"`);
  }
  return matches[0];
}

/* -------------------------------------------------------------------------- */
/* The foundational palette                                                   */
/* -------------------------------------------------------------------------- */

const tokens = read('tokens/tecton.tokens.json');

type TokenNode = {$value?: string} & Record<string, unknown>;

/** Every `foundational.color.*` path and the colour it holds. */
const paths: Array<{path: string[]; value: string}> = [];
(function walk(node: TokenNode, trail: string[]) {
  if (typeof node?.$value === 'string') {
    paths.push({path: trail, value: node.$value.toLowerCase()});
    return;
  }
  for (const [key, child] of Object.entries(node ?? {})) {
    if (key.startsWith('$')) continue;
    if (child && typeof child === 'object')
      walk(child as TokenNode, [...trail, key]);
  }
})(tokens.foundational.color as TokenNode, []);

function valueAt(trail: readonly string[]): string | null {
  let current: unknown = tokens.foundational.color;
  for (const key of trail) {
    current = (current as Record<string, unknown> | undefined)?.[key];
    if (current === undefined) return null;
  }
  const value = (current as TokenNode | undefined)?.$value;
  return typeof value === 'string' ? value.toLowerCase() : null;
}

/**
 * Derive the light-mode counterpart of a dark-mode value, from the rule alone:
 * find the one `onDark` token that carries it and read the same stop off the
 * `onLight` ramp. `gray` publishes its dark side under a `contrasts` sub-ramp
 * and its light side as a plain ramp, so that segment is dropped on the way
 * across.
 *
 * Returns `null` when the rule cannot decide: the value appears on more than
 * one ramp, or it is a `shades.*` entry with no light/dark pair at all.
 */
export function deriveLight(darkValue: string): string | null {
  const wanted = darkValue.toLowerCase();
  const candidates = paths.filter(
    entry => entry.value === wanted && entry.path[1] === 'onDark',
  );
  if (candidates.length !== 1) return null;

  const [family, , ...rest] = candidates[0].path;
  const stops =
    family === 'gray' ? rest.filter(key => key !== 'contrasts') : rest;
  return valueAt([family, 'onLight', ...stops]);
}

/** The `foundational.color` path a dark value comes from, for error messages. */
export function sourcePath(darkValue: string): string {
  const wanted = darkValue.toLowerCase();
  const found = paths.filter(entry => entry.value === wanted);
  return found.length === 1
    ? found[0].path.join('.')
    : `${found.length} matches`;
}

/** Compare two CSS colours written as hex, ignoring case. */
export const sameColor = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();
