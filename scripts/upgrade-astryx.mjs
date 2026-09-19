#!/usr/bin/env node
/**
 * Upgrade the upstream component library that @tecton/react is built on.
 *
 * Phase 1 stub: parses its arguments and reports that the real upgrade flow
 * (bump the exact pins in packages/react/package.json, reinstall, rerun
 * `astryx theme build`, rebuild the CSS bundle, diff the visual fixtures)
 * is not implemented yet.
 *
 * Usage: node scripts/upgrade-astryx.mjs --to <version>
 */
const args = process.argv.slice(2);
let target;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--to') {
    target = args[i + 1];
    i += 1;
  } else if (arg.startsWith('--to=')) {
    target = arg.slice('--to='.length);
  } else if (arg === '--help' || arg === '-h') {
    console.log('Usage: node scripts/upgrade-astryx.mjs --to <version>');
    process.exit(0);
  } else {
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
}

if (!target) {
  console.error('Missing required argument: --to <version>');
  console.error('Usage: node scripts/upgrade-astryx.mjs --to <version>');
  process.exit(2);
}

console.log(`Requested upgrade to ${target}: not implemented yet.`);
