#!/usr/bin/env node
/**
 * Generate `src/theme/palette.generated.ts` from `tokens/tecton.tokens.json`.
 *
 * The token file is the design system's foundational colour export (a DTCG
 * document whose only branch is `foundational.color`). Every colour the Tecton
 * theme uses has to be traceable back to it, so the theme never writes a hex
 * literal: it references a constant from the generated module, and this script
 * is the only thing that turns a design token into a string.
 *
 * Usage:
 *   node scripts/generate-palette.mjs            # write the module
 *   node scripts/generate-palette.mjs --check    # fail if it is out of date
 *
 * `--check` runs at the start of the package build and in `pnpm check`, so a
 * token export that changed without the module being regenerated fails loudly
 * instead of silently shipping stale colours.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..');
const TOKENS = path.join(REPO_ROOT, 'tokens', 'tecton.tokens.json');
const OUTPUT = path.join(PACKAGE_ROOT, 'src', 'theme', 'palette.generated.ts');

/**
 * The families the theme draws from, in the order they appear in the module.
 *
 * `MPL`, `Colorcet` and `custom` are data-visualisation palettes in the same
 * file; they carry no `onDark`/`onLight` ramps and no Tecton UI role cites
 * them, so they are deliberately left out.
 */
const FAMILIES = [
  'gray',
  'graphite',
  'mauve',
  'violet',
  'lilac',
  'orchid',
  'blue',
  'azure',
  'green',
  'lime',
  'lemon',
  'yellow',
  'saffron',
  'red',
  'pink',
  'hotPink',
];

/** Sub-ramps that hang off a `onDark`/`onLight` branch beside the plain stops. */
const SUB_RAMPS = ['core', 'surface', 'contrasts', 'saturations', 'washes'];

const isLeaf = node =>
  node !== null && typeof node === 'object' && typeof node.$value === 'string';

/**
 * Figma exports one stop name with a trailing comment — `460 (focus outline)`.
 * Strip it so the ramp key stays a plain numeric stop, and record the rename in
 * the module header so the mapping back to the token file stays obvious.
 */
const renames = [];
function stopKey(family, branch, raw) {
  const cleaned = raw.replace(/\s*\(.*\)$/, '');
  if (cleaned !== raw) {
    renames.push(`${family}.${branch}.${raw} → ${cleaned}`);
  }
  return cleaned;
}

function quoteKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`;
}

/** Render a ramp of plain stops as a one-entry-per-line object literal. */
function renderStops(entries, indent) {
  const pad = ' '.repeat(indent);
  return entries
    .map(([key, value]) => `${pad}${quoteKey(key)}: '${value}',`)
    .join('\n');
}

/**
 * Collect one `onDark` / `onLight` branch: its plain stops first, then every
 * sub-ramp it carries. `transparent` is two levels deep (stop → alpha step).
 */
function renderBranch(family, branch, node, indent) {
  const pad = ' '.repeat(indent);
  const lines = [];

  const stops = Object.entries(node)
    .filter(([, value]) => isLeaf(value))
    .map(([key, value]) => [stopKey(family, branch, key), value.$value]);
  if (stops.length > 0) lines.push(renderStops(stops, indent));

  for (const name of SUB_RAMPS) {
    const ramp = node[name];
    if (!ramp) continue;
    const entries = Object.entries(ramp)
      .filter(([, value]) => isLeaf(value))
      .map(([key, value]) => [key, value.$value]);
    lines.push(`${pad}${name}: {`);
    lines.push(renderStops(entries, indent + 2));
    lines.push(`${pad}},`);
  }

  if (node.transparent) {
    lines.push(`${pad}transparent: {`);
    for (const [stop, alphas] of Object.entries(node.transparent)) {
      lines.push(`${pad}  ${quoteKey(stop)}: {`);
      const entries = Object.entries(alphas)
        .filter(([, value]) => isLeaf(value))
        .map(([key, value]) => [key, value.$value]);
      lines.push(renderStops(entries, indent + 4));
      lines.push(`${pad}  },`);
    }
    lines.push(`${pad}},`);
  }

  return lines.join('\n');
}

function renderFamily(family, node) {
  const lines = [`  ${quoteKey(family)}: {`];
  for (const branch of ['onDark', 'onLight']) {
    if (!node[branch]) continue;
    lines.push(`    ${branch}: {`);
    lines.push(renderBranch(family, branch, node[branch], 6));
    lines.push('    },');
  }
  lines.push('  },');
  return lines.join('\n');
}

function renderShades(node) {
  const lines = ['export const shades = {'];
  for (const name of ['white', 'black']) {
    const shade = node[name];
    lines.push(`  ${name}: '${shade.$value}',`);
    lines.push(`  ${name}Transparent: {`);
    const entries = Object.entries(shade.transparent)
      .filter(([, value]) => isLeaf(value))
      .map(([key, value]) => [key, value.$value]);
    lines.push(renderStops(entries, 4));
    lines.push('  },');
  }
  lines.push('} as const;');
  return lines.join('\n');
}

function generate(tokens) {
  const colors = tokens.foundational.color;

  const families = FAMILIES.map(family => {
    if (!colors[family]) {
      throw new Error(`tokens/tecton.tokens.json has no family "${family}"`);
    }
    return renderFamily(family, colors[family]);
  });

  const shades = renderShades(colors.shades);

  const counted = countValues(colors);
  const renameNote =
    renames.length === 0
      ? ''
      : `\n * Stop names normalised (the export carries a parenthetical):\n${renames
          .map(line => ` *   ${line}`)
          .join('\n')}\n *`;

  return `/**
 * Tecton foundational colour palette — GENERATED, DO NOT EDIT.
 *
 * Written by \`packages/react/scripts/generate-palette.mjs\` from
 * \`tokens/tecton.tokens.json\` (${counted} colour values across ${FAMILIES.length} families).
 * Run \`node scripts/generate-palette.mjs\` after the token export changes;
 * \`--check\` guards against drift on every build.
 *
 * Shape, per family:
 *   <family>.onDark.<stop>                  the ramp used on dark surfaces
 *   <family>.onDark.core.<stop>             the saturated "core" sub-ramp
 *   <family>.onDark.surface.<stop>          surface tints (graphite, mauve)
 *   <family>.onDark.contrasts.<stop>        gray only — the neutral contrast ramp
 *   <family>.onDark.saturations|washes.<n>  gray only — tinted neutrals
 *   <family>.onDark.transparent.<stop>.<a>  the alpha ladder for one stop
 *   <family>.onLight.…                      the same shape, for light surfaces
 *
 * Stops run 50 → 1570. On \`onDark\` a higher stop is *lighter*; on \`onLight\` a
 * higher stop is *darker*. That inversion is what makes the light mode
 * derivation "same family, same stop, other ramp" work — see
 * \`docs/design/light-mode.md\`.${renameNote}
 */

${shades}

export const palette = {
${families.join('\n')}
} as const;

/** Every colour family the palette carries. */
export type PaletteFamily = keyof typeof palette;

/** The two surface ramps every family is published in. */
export type PaletteBranch = 'onDark' | 'onLight';
`;
}

function countValues(node) {
  let count = 0;
  const walk = current => {
    if (isLeaf(current)) {
      count += 1;
      return;
    }
    if (current === null || typeof current !== 'object') return;
    for (const value of Object.values(current)) walk(value);
  };
  for (const family of FAMILIES) walk(node[family]);
  walk(node.shades);
  return count;
}

const tokens = JSON.parse(await fsp.readFile(TOKENS, 'utf8'));
const next = generate(tokens);

if (process.argv.includes('--check')) {
  // Compared after normalising line endings so a CRLF checkout does not
  // read as drift.
  const current = fs.existsSync(OUTPUT)
    ? (await fsp.readFile(OUTPUT, 'utf8')).replace(/\r\n/g, '\n')
    : null;
  if (current !== next) {
    console.error(
      `\n${path.relative(REPO_ROOT, OUTPUT)} is out of date with ` +
        `${path.relative(REPO_ROOT, TOKENS)}.\n` +
        'Run: pnpm --filter @tecton/react generate:palette\n',
    );
    process.exit(1);
  }
  console.log(`${path.relative(REPO_ROOT, OUTPUT)} is up to date.`);
} else {
  await fsp.writeFile(OUTPUT, next, 'utf8');
  console.log(
    `${path.relative(REPO_ROOT, OUTPUT)} written (${(Buffer.byteLength(next) / 1024).toFixed(1)} kB).`,
  );
}
