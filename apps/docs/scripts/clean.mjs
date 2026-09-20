#!/usr/bin/env node
/**
 * Remove everything the site generates.
 *
 * It is a script rather than an `rm -rf` in `package.json` because the people
 * who run this repository run it on Windows too, where `rm` is not a command.
 */
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const GENERATED = [
  'dist',
  '.tanstack',
  'node_modules/.vite',
  'src/generated',
  'content/docs/components',
  'content/docs/foundations',
  'content/docs/templates',
];

for (const entry of GENERATED) {
  await fsp.rm(path.join(APP_ROOT, entry), {recursive: true, force: true});
}
