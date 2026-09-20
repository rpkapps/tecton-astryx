/*
 * Ad-hoc: capture a fixed set of examples, both renders, plus one with a
 * control focused, into a single directory. Used to produce the before/after
 * pairs `docs/design/theme-audit.md` cites.
 *
 *   node evidence.mjs <outDir>
 */
import {spawnSync} from 'node:child_process';
import {cpSync, mkdirSync, rmSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const out = path.resolve(process.argv[2] ?? '.audit/evidence');
const shots = path.join(out, 'shots');
const tmp = path.join(out, 'tmp');

const EXAMPLES = [
  'EmptyState/EmptyStateActions',
  'ButtonGroup/ButtonGroupBasic',
  'Table/TableShowcase',
  'TextInput/TextInputStates',
  'Card/CardVariants',
  'Switch/SwitchShowcase',
];

/** [example, how many tabs to reach the control worth looking at] */
const FOCUSED = [
  ['Button/ButtonVariants', 1],
  ['TextInput/TextInputSizes', 1],
  ['ButtonGroup/ButtonGroupShowcase', 1],
];

rmSync(out, {recursive: true, force: true});
mkdirSync(shots, {recursive: true});

for (const example of EXAMPLES) {
  const result = spawnSync(
    process.execPath,
    [
      path.join(HERE, 'scripts', 'audit.mjs'),
      '--only',
      example,
      '--shots',
      'all',
      '--port',
      '5300',
      '--out',
      tmp,
    ],
    {cwd: HERE, encoding: 'utf8'},
  );
  if (result.status !== 0) {
    process.stderr.write(`${example}: ${result.stderr?.slice(0, 400)}\n`);
    continue;
  }
  for (const file of readdirSync(path.join(tmp, 'shots'))) {
    cpSync(path.join(tmp, 'shots', file), path.join(shots, file));
  }
  process.stdout.write(`  ${example}\n`);
}

for (const [example, tabs] of FOCUSED) {
  const result = spawnSync(
    process.execPath,
    [path.join(HERE, 'focusshot.mjs'), example, shots, String(tabs), '5601'],
    {cwd: HERE, encoding: 'utf8'},
  );
  process.stdout.write(`  ${example} (focused)\n${result.stdout ?? ''}`);
}

rmSync(tmp, {recursive: true, force: true});
process.stdout.write(`→ ${shots}\n`);
