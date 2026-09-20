#!/usr/bin/env node
/**
 * Upgrade the whole repository to a new release of the upstream component
 * library `@tecton/react` is built on.
 *
 * ## What this owns
 *
 * Everything in the repository that is downstream of the upstream version, in
 * the order the dependencies actually run:
 *
 *   1. preflight   — a clean tree, a version that exists, the current pin
 *   2. bump        — every workspace pin, the patch key, the patch file name
 *   3. install     — `pnpm install`, which is also where the patch is applied
 *   4. codemods    — the upstream CLI's own migrations, over every source tree
 *   5. regenerate  — the theme, the token manifest, the palette and the icons
 *   6. inventories — what the new release contains
 *   7. report      — one markdown file per upgrade, written to docs/
 *   8. check       — `pnpm check` and `pnpm check:mfe`
 *   9. snapshot    — re-pin the component/target/token inventories
 *
 * (A dry run adds one step after the install it skips: fetching the target
 * release into a scratch directory, which is where it reports from.)
 *
 * Each step prints a heading, and each one fails loudly and on its own: a step
 * that cannot finish stops the run where it is, with the tree in a state a
 * human can pick up. Nothing is ever skipped quietly — least of all the patch
 * (`docs/engineering/upstream-patches.md`), because a silently dropped patch
 * ships the S1 frozen-page defect to every consumer.
 *
 * ## Re-running it
 *
 * It is idempotent. Every step detects the work it has already done — pins
 * that are already at the target, a patch file that is already renamed, a
 * manifest that already matches — so after a manual fix (a patch re-created by
 * hand, a codemod finished off in an editor) the same command picks the run up
 * where it stopped.
 *
 * ## Usage
 *
 *   pnpm upgrade-astryx --to <version|dist-tag> [options]
 *   pnpm snapshot:astryx          # just re-pin the inventories
 *
 * Options:
 *   --to <version>   the release to move to; a dist-tag (`latest`, `canary`)
 *                    is resolved against the registry
 *   --dry-run        change nothing: resolve the target, install it into a
 *                    scratch directory and write the report it *would* write
 *   --yes            do not ask before applying codemods
 *   --skip-checks    skip `pnpm check` and `pnpm check:mfe`
 *   --allow-dirty    run with uncommitted changes in the tree
 *   --force          pass `--force` to the codemod runner (needed when the
 *                    target is older than the current pin)
 *   --snapshot       only refresh scripts/astryx-snapshot/, then stop
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createInterface} from 'node:readline/promises';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REACT = path.join(ROOT, 'packages', 'react');
const SNAPSHOT_DIR = path.join(ROOT, 'scripts', 'astryx-snapshot');
const REPORT_DIR = path.join(ROOT, 'docs', 'engineering', 'upgrades');
const SCRATCH = path.join(ROOT, 'node_modules', '.cache', 'astryx-upgrade');

const CORE = '@astryxdesign/core';
const CLI = '@astryxdesign/cli';
/** Every upstream package whose pin this script owns, if it is present. */
const UPSTREAM = [CORE, CLI, '@astryxdesign/build'];
const DEP_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

/** The single source of truth for which upstream version Tecton is built on. */
const PIN_SOURCE = ['packages/react/package.json', 'devDependencies', CORE];

const PATCH_DOC = 'docs/engineering/upstream-patches.md';

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

const USAGE = `Usage: pnpm upgrade-astryx --to <version|dist-tag> [options]

  --to <version>  the release to move to (a dist-tag is resolved for you)
  --dry-run       change nothing; report what the upgrade would do
  --yes           apply codemods without asking
  --skip-checks   skip \`pnpm check\` and \`pnpm check:mfe\`
  --allow-dirty   run with uncommitted changes in the tree
  --force         pass --force to the codemod runner (for a downgrade)
  --snapshot      only refresh scripts/astryx-snapshot/, then stop
`;

function parseArgs(argv) {
  const options = {
    to: undefined,
    dryRun: false,
    yes: false,
    skipChecks: false,
    allowDirty: false,
    force: false,
    snapshot: false,
  };
  const flags = {
    '--dry-run': 'dryRun',
    '--yes': 'yes',
    '-y': 'yes',
    '--skip-checks': 'skipChecks',
    '--allow-dirty': 'allowDirty',
    '--force': 'force',
    '--snapshot': 'snapshot',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--to') {
      options.to = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--to=')) {
      options.to = arg.slice('--to='.length);
    } else if (arg === '--help' || arg === '-h') {
      process.stdout.write(USAGE);
      process.exit(0);
    } else if (arg in flags) {
      options[flags[arg]] = true;
    } else {
      console.error(`Unknown argument: ${arg}\n\n${USAGE}`);
      process.exit(2);
    }
  }
  if (!options.snapshot && !options.to) {
    console.error(`Missing required argument: --to <version>\n\n${USAGE}`);
    process.exit(2);
  }
  return options;
}

// ---------------------------------------------------------------------------
// Output, and failing loudly
// ---------------------------------------------------------------------------

const RULE = '─'.repeat(74);
let stepNumber = 0;

/** A step that could not finish. Its message is the whole explanation. */
class StepError extends Error {
  constructor(step, lines) {
    super(Array.isArray(lines) ? lines.join('\n') : String(lines));
    this.step = step;
  }
}

let currentStep = '(startup)';

function step(title) {
  stepNumber += 1;
  currentStep = title;
  console.log(`\n${RULE}\n  STEP ${stepNumber} — ${title}\n${RULE}`);
}

function note(message) {
  console.log(`  ${message}`);
}

function ok(message) {
  console.log(`  ✓ ${message}`);
}

function warn(message) {
  console.log(`  ! ${message}`);
}

function fail(lines) {
  throw new StepError(currentStep, lines);
}

// ---------------------------------------------------------------------------
// Running things
// ---------------------------------------------------------------------------

/**
 * Run a command, streaming its output and keeping a copy.
 *
 * Every step that reports on what a tool said needs both: the engineer running
 * the upgrade watches it happen, and the report quotes it afterwards.
 */
function sh(
  command,
  args,
  {cwd = ROOT, quiet = false, stream = false, env} = {},
) {
  if (!quiet) note(`$ ${command} ${args.join(' ')}`);
  // `stream` is for the steps that take minutes and whose output nothing reads
  // back — the checks. Everything else is captured, because the report quotes
  // it, and is echoed when the command returns.
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {...process.env, ...env},
    maxBuffer: 64 * 1024 * 1024,
    stdio: stream ? 'inherit' : 'pipe',
  });
  if (result.error) {
    fail([`Could not run \`${command}\`: ${result.error.message}`]);
  }
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (!quiet && output.trim()) {
    console.log(
      output
        .trimEnd()
        .split('\n')
        .map(line => `  │ ${line}`)
        .join('\n'),
    );
  }
  return {status: result.status ?? 1, output};
}

function mustRun(command, args, options = {}) {
  const result = sh(command, args, options);
  if (result.status !== 0) {
    fail([
      `\`${command} ${args.join(' ')}\` exited with ${result.status}.`,
      ...(options.hint ?? []),
    ]);
  }
  return result;
}

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) =>
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

// ---------------------------------------------------------------------------
// Versions
// ---------------------------------------------------------------------------

/** Compare two semver strings; a prerelease sorts below its own release. */
function compareVersions(a, b) {
  const split = v => {
    const [core, pre = ''] = String(v).split('-');
    return [core.split('.').map(Number), pre];
  };
  const [aCore, aPre] = split(a);
  const [bCore, bPre] = split(b);
  for (let i = 0; i < 3; i += 1) {
    const diff = (aCore[i] ?? 0) - (bCore[i] ?? 0);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  if (aPre === bPre) return 0;
  if (aPre === '') return 1;
  if (bPre === '') return -1;
  return aPre < bPre ? -1 : 1;
}

/** Ask the registry what `--to` names, and refuse anything it does not know. */
function resolveTarget(requested) {
  const result = sh(
    'npm',
    ['view', `${CORE}@${requested}`, 'version', '--json'],
    {
      quiet: true,
    },
  );
  let resolved;
  if (result.status === 0 && result.output.trim()) {
    try {
      const parsed = JSON.parse(result.output);
      resolved = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
    } catch {
      resolved = undefined;
    }
  }
  if (!resolved) {
    fail([
      `The registry has no ${CORE}@${requested}.`,
      '',
      `  npm view ${CORE} versions --json     lists every release`,
      `  npm view ${CORE} dist-tags           lists latest and canary`,
      '',
      result.output.trim() || '(npm said nothing)',
    ]);
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// The workspace's manifests
// ---------------------------------------------------------------------------

/** Every package.json in the workspace, root first. */
function workspaceManifests() {
  const yaml = fs.readFileSync(path.join(ROOT, 'pnpm-workspace.yaml'), 'utf8');
  const patterns = [...yaml.matchAll(/^\s*-\s*'?"?([^'"\n]+)'?"?\s*$/gm)].map(
    match => match[1].trim(),
  );
  const files = [path.join(ROOT, 'package.json')];
  for (const pattern of patterns) {
    const [head, star] = pattern.split('/*');
    if (star === undefined) {
      const file = path.join(ROOT, pattern, 'package.json');
      if (fs.existsSync(file)) files.push(file);
      continue;
    }
    const dir = path.join(ROOT, head);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (!entry.isDirectory()) continue;
      const file = path.join(dir, entry.name, 'package.json');
      if (fs.existsSync(file)) files.push(file);
    }
  }
  return files;
}

/** The pin the rest of the repository is measured against. */
function currentPin(source) {
  const [file, field, name] = PIN_SOURCE;
  const manifest =
    source === undefined ? readJson(path.join(ROOT, file)) : JSON.parse(source);
  const range = manifest[field]?.[name];
  if (!range) {
    fail([
      `${file} has no ${field} on ${name}, and that pin is this repository's`,
      'single source of truth for the upstream version.',
    ]);
  }
  const version = range.replace(/^[\^~><= ]+/, '');
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    fail([`${file} pins ${name} as "${range}", which is not one version.`]);
  }
  return version;
}

/**
 * The pin as the last commit has it.
 *
 * A re-run — after a patch was re-created by hand, say — finds the pins
 * already bumped, and "from the version we are already on" is not the range
 * the codemods or the report are about. The committed pin is, so a resumed run
 * reads it from there and carries on as the same upgrade.
 */
function committedPin() {
  const head = sh('git', ['show', `HEAD:${PIN_SOURCE[0]}`], {quiet: true});
  if (head.status !== 0) return null;
  try {
    return currentPin(head.output);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// The upstream package, wherever it is installed
// ---------------------------------------------------------------------------

/**
 * Where the upstream package and its CLI are, seen from one directory.
 *
 * Normally that directory is `packages/react`, whose devDependencies are the
 * pin. In `--dry-run` it is a scratch install of the target version, so the
 * report can name the new release's components, targets and tokens without
 * anything in the repository having moved.
 */
function astryxAt(fromDir) {
  const require = createRequire(path.join(fromDir, 'package.json'));
  const css = require.resolve(`${CORE}/astryx.css`);
  const corePackage = path.resolve(path.dirname(css), '..');
  const manifest = readJson(path.join(corePackage, 'package.json'));
  return {
    dir: fromDir,
    corePackage,
    coreManifest: manifest,
    version: manifest.version,
    baseCss: css,
    cliBin: require.resolve(CLI),
  };
}

/** Run the upstream CLI and parse its `--json` envelope. */
function astryxJson(astryx, args) {
  const result = sh(process.execPath, [astryx.cliBin, ...args, '--json'], {
    cwd: astryx.dir,
    quiet: true,
  });
  const start = result.output.indexOf('{');
  if (result.status !== 0 || start === -1) {
    fail([
      `\`astryx ${args.join(' ')} --json\` failed.`,
      result.output.trim() || '(no output)',
    ]);
  }
  try {
    return JSON.parse(result.output.slice(start));
  } catch (error) {
    fail([
      `Could not read \`astryx ${args.join(' ')} --json\`: ${error.message}`,
    ]);
  }
}

/** Every component the installed release exposes, flat and sorted. */
function componentInventory(astryx) {
  const envelope = astryxJson(astryx, ['component', '--list']);
  const groups = envelope.data?.components ?? {};
  const names = new Set();
  for (const entries of Object.values(groups)) {
    for (const entry of entries) names.add(entry.name);
  }
  return [...names].sort();
}

/** Every theming target key the installed release exposes. */
function targetInventory(astryx) {
  const envelope = astryxJson(astryx, ['theme', 'targets']);
  return (envelope.data?.targets ?? []).map(target => target.key).sort();
}

/** Every custom property the release's own base stylesheet declares. */
function tokenInventory(astryx) {
  const css = fs.readFileSync(astryx.baseCss, 'utf8');
  const names = new Set();
  for (const match of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g))
    names.add(match[1]);
  return [...names].sort();
}

/** The `# <version>` sections of the upstream changelog, newest first. */
function changelogSections(astryx) {
  const file = path.join(astryx.corePackage, 'CHANGELOG.md');
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const sections = [];
  const heading = /^# (\d+\.\d+\.\d+[^\s]*)\s*$/gm;
  const matches = [...text.matchAll(heading)];
  for (const [index, match] of matches.entries()) {
    const start = match.index + match[0].length;
    const end =
      index + 1 < matches.length ? matches[index + 1].index : text.length;
    sections.push({
      version: match[1],
      body: text
        .slice(start, end)
        .replace(/\n*-{3,}\n*$/, '')
        .trim(),
    });
  }
  return sections;
}

// ---------------------------------------------------------------------------
// What packages/react/src imports from upstream
// ---------------------------------------------------------------------------

function listFiles(dir, test, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, test, out);
    else if (test(full)) out.push(full);
  }
  return out;
}

/**
 * Every `@astryxdesign/core/<X>` import in `packages/react/src`, with the
 * names each one brings in and the module it belongs to.
 *
 * Most of them are the generated subpath modules, one line each; the rest are
 * the provider, the theme and the package root.
 */
function wrapperImports() {
  const hits = [];
  const files = listFiles(
    path.join(REACT, 'src'),
    file => /\.tsx?$/.test(file) && !file.endsWith('.d.ts'),
  );
  const pattern =
    /import\s+(type\s+)?([\s\S]*?)\s*from\s*['"](@astryxdesign\/[^'"]+)['"]/g;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(pattern)) {
      const clause = match[2];
      const names = [
        ...clause.matchAll(/([A-Za-z_$][\w$]*)(?:\s+as\s+[\w$]+)?/g),
      ]
        .map(name => name[1])
        .filter(name => name !== 'type');
      const relative = path.relative(ROOT, file);
      const component = /src\/modules\/(.+)\/index\.ts$/.exec(
        relative.split(path.sep).join('/'),
      )?.[1];
      hits.push({file: relative, specifier: match[3], names, component});
    }
  }
  return hits;
}

/** Does this specifier still resolve through the release's exports map? */
function resolvesInExports(astryx, specifier) {
  const exportsMap = astryx.coreManifest.exports ?? {};
  const subpath = specifier === CORE ? '.' : `.${specifier.slice(CORE.length)}`;
  const pick = entry =>
    typeof entry === 'string' ? entry : (entry?.default ?? entry?.types);

  let target = pick(exportsMap[subpath]);
  if (target === undefined) {
    for (const [pattern, entry] of Object.entries(exportsMap)) {
      const star = pattern.indexOf('*');
      if (star === -1) continue;
      const head = pattern.slice(0, star);
      const tail = pattern.slice(star + 1);
      if (!subpath.startsWith(head) || !subpath.endsWith(tail)) continue;
      target = pick(entry)?.replace(
        '*',
        subpath.slice(head.length, subpath.length - tail.length),
      );
      break;
    }
  }
  if (target === undefined) return false;
  return fs.existsSync(path.join(astryx.corePackage, target));
}

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

const SNAPSHOT_FILES = {
  components: 'components.json',
  targets: 'targets.json',
  tokens: 'tokens.json',
};

function readSnapshot(kind) {
  const file = path.join(SNAPSHOT_DIR, SNAPSHOT_FILES[kind]);
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

function writeSnapshot(kind, astryx, names, comment) {
  fs.mkdirSync(SNAPSHOT_DIR, {recursive: true});
  writeJson(path.join(SNAPSHOT_DIR, SNAPSHOT_FILES[kind]), {
    comment,
    package: CORE,
    version: astryx.version,
    count: names.length,
    [kind]: names,
  });
}

const SNAPSHOT_COMMENTS = {
  components:
    'Every component the pinned upstream release exposes, from `astryx ' +
    'component --list --json`. Refresh with `pnpm snapshot:astryx`; ' +
    '`pnpm upgrade-astryx` diffs against it and then rewrites it.',
  targets:
    'Every theming target key the pinned upstream release exposes, from ' +
    '`astryx theme targets --json`. Refresh with `pnpm snapshot:astryx`.',
  tokens:
    'Every custom property the pinned upstream release declares in its own ' +
    'base stylesheet — the token surface a Tecton theme can set. Refresh ' +
    'with `pnpm snapshot:astryx`.',
};

function takeInventories(astryx) {
  return {
    components: componentInventory(astryx),
    targets: targetInventory(astryx),
    tokens: tokenInventory(astryx),
  };
}

function refreshSnapshots(astryx, inventories) {
  for (const kind of Object.keys(SNAPSHOT_FILES)) {
    writeSnapshot(kind, astryx, inventories[kind], SNAPSHOT_COMMENTS[kind]);
    note(
      `${path.relative(ROOT, path.join(SNAPSHOT_DIR, SNAPSHOT_FILES[kind]))} ` +
        `— ${inventories[kind].length} entries at ${astryx.version}`,
    );
  }
}

/** added / removed, against a snapshot that may not exist yet. */
function diffAgainstSnapshot(kind, names) {
  const snapshot = readSnapshot(kind);
  if (!snapshot) return {baseline: null, added: [], removed: []};
  const before = new Set(snapshot[kind] ?? []);
  const after = new Set(names);
  return {
    baseline: snapshot.version,
    added: [...after].filter(name => !before.has(name)).sort(),
    removed: [...before].filter(name => !after.has(name)).sort(),
  };
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

/** 1 — preflight. */
function preflight(options) {
  step('Preflight');

  const dirty = sh('git', ['status', '--porcelain'], {quiet: true});
  if (dirty.status !== 0) fail(['This is not a git working tree.']);
  const changed = dirty.output.trim();
  if (changed && !options.allowDirty) {
    fail([
      'The working tree has uncommitted changes. An upgrade rewrites manifests,',
      'sources and generated files across the repository, and `git diff` is how',
      'it is reviewed — so it starts from a clean tree.',
      '',
      changed,
      '',
      'Commit or stash them, or re-run with --allow-dirty if you know why they',
      'are there.',
    ]);
  }
  if (changed)
    warn(`--allow-dirty: ${changed.split('\n').length} paths already modified`);

  let from = currentPin();
  const to = resolveTarget(options.to);
  let resumed = false;
  if (from === to) {
    const committed = committedPin();
    if (committed && committed !== to) {
      warn(
        `the pins are already at ${to} but HEAD still has ${committed}: picking ` +
          'this run up as a resumed upgrade.',
      );
      from = committed;
      resumed = true;
    }
  }
  ok(`current pin: ${CORE}@${from} (${PIN_SOURCE[0]} → ${PIN_SOURCE[1]})`);
  ok(
    `target:      ${CORE}@${to}${to === options.to ? '' : ` (from "${options.to}")`}`,
  );

  const direction = compareVersions(to, from);
  if (direction === 0 && !resumed) {
    warn(
      `${from} is already the pin — this run will re-do everything downstream of it.`,
    );
  } else if (direction < 0) {
    warn(`${to} is OLDER than ${from}: this is a downgrade.`);
    if (!options.force) {
      warn(
        'The codemod runner refuses a backwards range; pass --force to run it anyway.',
      );
    }
  }
  return {from, to, direction, resumed};
}

/** 2 — bump every pin, the patch key and the patch file. */
function bumpPins({to}, options) {
  step(`Bumping every pin to ${to}`);

  const changes = [];
  const alreadyDone = [];

  for (const file of workspaceManifests()) {
    const relative = path.relative(ROOT, file);
    const manifest = readJson(file);
    const before = fs.readFileSync(file, 'utf8');
    let text = before;

    // Every edit is made on the TEXT, keyed by what the parsed manifest says
    // is there. A JSON round-trip would re-print the whole file — different
    // escaping, different key order in places — and an upgrade's diff should
    // be the versions it changed and nothing else.
    for (const field of DEP_FIELDS) {
      const deps = manifest[field];
      if (!deps) continue;
      for (const name of UPSTREAM) {
        const range = deps[name];
        if (range === undefined) continue;
        const prefix = /^[\^~]/.test(range) ? range[0] : '';
        const next = `${prefix}${to}`;
        if (range === next) {
          alreadyDone.push(`${relative} ${field}.${name} = ${range}`);
          continue;
        }
        changes.push(`${relative} ${field}.${name}: ${range} → ${next}`);
        text = text.replace(
          new RegExp(
            `("${escapeRegExp(name)}"\\s*:\\s*)"${escapeRegExp(range)}"`,
            'g',
          ),
          `$1"${next}"`,
        );
      }
    }

    // The patch key carries the version in its name, and so does the file it
    // points at. Both move with the pin, or `pnpm install` applies nothing.
    const patched = manifest.pnpm?.patchedDependencies;
    if (patched) {
      for (const key of Object.keys(patched)) {
        if (!key.startsWith(`${CORE}@`)) continue;
        const nextKey = `${CORE}@${to}`;
        const nextValue = `patches/${CORE.replace('/', '__')}@${to}.patch`;
        if (key === nextKey && patched[key] === nextValue) {
          alreadyDone.push(`${relative} pnpm.patchedDependencies["${key}"]`);
          continue;
        }
        changes.push(
          `${relative} pnpm.patchedDependencies: ${key} → ${nextKey}`,
        );
        text = text.replace(
          new RegExp(`"${escapeRegExp(key)}"(\\s*:\\s*)"[^"]*"`),
          `"${nextKey}"$1"${nextValue}"`,
        );
        renamePatchFile(patched[key], nextValue, options, changes);
      }
    }

    if (text === before || options.dryRun) continue;
    assertStillJson(relative, text, to);
    fs.writeFileSync(file, text, 'utf8');
  }

  for (const line of alreadyDone) note(`= ${line} (already at the target)`);
  for (const line of changes) note(`→ ${line}`);
  if (changes.length === 0) {
    ok('every pin was already at the target — nothing to bump');
  } else if (options.dryRun) {
    ok(`${changes.length} edits, not written (--dry-run)`);
  } else {
    ok(`${changes.length} edits written`);
  }
  return {changes, alreadyDone};
}

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A text edit that produced something that is not the manifest any more is a
 * bug in this script, and it must not reach `pnpm install`.
 */
function assertStillJson(relative, text, to) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    fail([`Bumping ${relative} produced invalid JSON: ${error.message}`]);
  }
  for (const field of DEP_FIELDS) {
    for (const name of UPSTREAM) {
      const range = parsed[field]?.[name];
      if (range !== undefined && range.replace(/^[\^~]/, '') !== to) {
        fail([`${relative} still pins ${name} at "${range}" after the bump.`]);
      }
    }
  }
}

/** Move the committed patch file to the name the new key points at. */
function renamePatchFile(oldValue, nextValue, options, changes) {
  const oldFile = path.join(ROOT, oldValue);
  const newFile = path.join(ROOT, nextValue);
  if (oldValue === nextValue) return;
  if (!fs.existsSync(oldFile)) {
    if (fs.existsSync(newFile)) return; // a re-run: it moved last time
    fail([
      `${oldValue} is referenced by pnpm.patchedDependencies but does not exist.`,
      `Re-create it against ${CORE} following ${PATCH_DOC}.`,
    ]);
  }
  changes.push(`${oldValue} → ${nextValue}`);
  if (options.dryRun) return;
  const moved = sh('git', ['mv', oldValue, nextValue], {quiet: true});
  if (moved.status !== 0) fs.renameSync(oldFile, newFile);
}

/** 3 — install, where the patch is applied or loudly is not. */
function install(options, {from, to}) {
  step('Installing');
  if (options.dryRun) {
    note('--dry-run: not installing into the workspace');
    return {output: '(skipped: --dry-run)'};
  }

  const result = sh('pnpm', ['install']);
  if (result.status === 0) {
    ok('pnpm install finished');
    return result;
  }

  // "patch" on its own appears in an ordinary install's output, so the test is
  // for what pnpm says when a patch is the thing that failed.
  const patchFailed =
    /ERR_PNPM_PATCH|could not apply patch|failed to apply|hunk/i.test(
      result.output,
    );
  if (!patchFailed) {
    fail([`pnpm install exited with ${result.status}.`]);
  }
  fail([
    `THE PATCH DID NOT APPLY TO ${CORE}@${to}.`,
    '',
    'This is a release blocker, not a nuisance, and it is never skipped: the',
    'patch is what keeps one scroll lock and one layer stack per document, and',
    'a dropped patch ships the S1 frozen-page defect to every consumer.',
    '',
    `The pins are bumped and the patch file is renamed — the tree is left in`,
    'that state on purpose, so the work below starts from it. Do not revert it',
    'and do not force the install.',
    '',
    `The procedure is ${PATCH_DOC} ("When a new upstream release fails to`,
    'apply the patch"), in short:',
    '',
    `  1. Read ${to}'s changelog and the two modules. If upstream now keys`,
    '     useScrollLock / layerStack on `document` itself, delete that half of',
    '     the patch (or the whole file and the pnpm.patchedDependencies entry)',
    '     and keep the harness assertions as they are.',
    '  2. Otherwise re-create it — never hand-edit the .patch file:',
    '',
    `       pnpm patch ${CORE}@${to}`,
    '       # edit the four files in the printed directory, following the doc:',
    '       #   src/hooks/useScrollLock.ts  + dist/hooks/useScrollLock.js',
    '       #   src/Layer/layerStack.ts     + dist/Layer/layerStack.js',
    "       pnpm patch-commit '<printed directory>'",
    '',
    `     The new file is already named patches/${CORE.replace('/', '__')}@${to}.patch,`,
    '     which is what this run pointed the key at.',
    '  3. Verify: `pnpm --filter @tecton/react build` asserts the vendored code',
    '     carries both Symbol.for keys, and `pnpm check:mfe` re-runs the four',
    '     harness assertions in a browser.',
    '',
    `  4. Then re-run this script: \`pnpm upgrade-astryx --to ${to}\`. It is`,
    '     idempotent — it will see the pins are already bumped and carry on',
    '     from the install.',
    '',
    `(Upgrading from ${from}.)`,
    '',
    'pnpm said:',
    result.output.trim(),
  ]);
}

/** The package a directory belongs to — the codemod runner's project root. */
function packageRootFor(dir) {
  let current = dir;
  while (current !== ROOT && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'package.json'))) return current;
    current = path.dirname(current);
  }
  return ROOT;
}

/**
 * Every source tree the codemods should see, with the directory each run has
 * to start from.
 *
 * The runner refuses a `--path` outside its own project root and finds the
 * installed release by resolving from its working directory, so one run per
 * workspace it is: `packages/react` and `apps/docs` both have the upstream
 * package, and a consumer fixture that does not is reported as such rather
 * than silently skipped.
 */
function codemodTargets() {
  const dirs = [
    path.join(REACT, 'src'),
    path.join(ROOT, 'apps', 'docs', 'src'),
  ];
  const fixtures = path.join(ROOT, 'fixtures', 'consumers');
  if (fs.existsSync(fixtures)) {
    for (const entry of fs.readdirSync(fixtures, {withFileTypes: true})) {
      if (entry.isDirectory())
        dirs.push(path.join(fixtures, entry.name, 'src'));
    }
  }
  return dirs
    .filter(dir => fs.existsSync(dir))
    .map(dir => {
      const cwd = packageRootFor(dir);
      return {
        dir,
        cwd,
        relative: path.relative(ROOT, dir).split(path.sep).join('/'),
        arg: path.relative(cwd, dir).split(path.sep).join('/'),
      };
    });
}

/** The codemods a release ships, by name. */
function codemodCatalogue(astryx) {
  const envelope = astryxJson(astryx, ['upgrade', '--list']);
  return (envelope.data ?? []).map(entry => ({
    name: entry.name,
    title: entry.title,
    optional: entry.optional === true,
  }));
}

/** The runner could not see an upstream install in this workspace. */
const NO_UPSTREAM = /Could not find installed @astryxdesign\/core/;

/**
 * 4 — the upstream CLI's own migrations.
 *
 * `local` is the workspace's own install: in a real run it is the release that
 * was just installed and it runs the codemods; in a dry run nothing was
 * installed, so it is still the old release and all it can do is preview. The
 * target's own catalogue (`astryx upgrade --list`, read from `astryx`) is what
 * a dry run reports instead — the codemods the new release ships that this one
 * does not have.
 */
async function codemods(options, {from, to, direction}, astryx, local) {
  step(`Codemods for ${from} → ${to}`);

  const targets = codemodTargets();
  for (const target of targets) note(`will scan ${target.relative}`);

  if (direction < 0 && !options.force) {
    warn(
      'A downgrade has no forward codemods; the runner will say so and change ' +
        'nothing. Re-run with --force to make it run them anyway.',
    );
  }

  /** What the new release ships that the installed one does not. */
  let newCodemods = [];
  if (options.dryRun) {
    const before = new Set(codemodCatalogue(local).map(entry => entry.name));
    newCodemods = codemodCatalogue(astryx).filter(
      entry => !before.has(entry.name),
    );
    note(
      `--dry-run: nothing is applied. ${to} ships ${newCodemods.length} codemod(s) ` +
        `${local.version} does not:`,
    );
    for (const entry of newCodemods) {
      note(
        `  + ${entry.name} — ${entry.title}${entry.optional ? ' (optional)' : ''}`,
      );
    }
    if (newCodemods.length === 0) note('  (none)');
    warn(
      'A preview cannot know the full range: the runner reads its target from the ' +
        `install, which is still ${local.version} here. The previews below are for ` +
        `${from} → ${local.version}.`,
    );
  }

  const cli = options.dryRun ? local : astryx;
  const common = ['upgrade', '--from', from, '--install-deps'];
  if (options.force) common.push('--force');

  const runs = [];
  for (const target of targets) {
    note(`\n  ── dry run: ${target.relative}`);
    const preview = sh(
      process.execPath,
      [cli.cliBin, ...common, '--path', target.arg],
      {cwd: target.cwd},
    );
    if (preview.status !== 0) {
      if (NO_UPSTREAM.test(preview.output)) {
        warn(
          `${target.relative}: no upstream package resolves from ` +
            `${path.relative(ROOT, target.cwd) || '.'}, so the runner has nothing ` +
            'to migrate against. Skipped, and recorded in the report.',
        );
        runs.push({
          path: target.relative,
          skipped: true,
          preview: preview.output.trim(),
          applied: null,
        });
        continue;
      }
      fail([
        `The codemod dry run failed for ${target.relative} (exit ${preview.status}).`,
        'Nothing has been applied. Fix the cause, or re-run past a failing',
        'codemod with `--skip-codemod <name>` through the CLI directly.',
        '',
        preview.output.trim(),
      ]);
    }
    runs.push({
      path: target.relative,
      target,
      skipped: false,
      preview: preview.output.trim(),
      applied: null,
    });
  }

  runs.newCodemods = newCodemods;

  const pending = runs.filter(
    run =>
      !run.skipped &&
      !/No codemods available|Already up to date|No changes needed/i.test(
        run.preview,
      ),
  );
  if (options.dryRun) {
    ok('dry run only — nothing applied');
    return runs;
  }
  if (pending.length === 0) {
    ok('the runner has no codemods to apply for this range');
    return runs;
  }
  if (!options.yes && !(await confirm('Apply these codemods?'))) {
    fail([
      'Stopped before applying codemods.',
      'The pins are bumped and the install is done; re-run with --yes to go on.',
    ]);
  }

  for (const run of pending) {
    note(`\n  ── applying: ${run.path}`);
    const applied = sh(
      process.execPath,
      [cli.cliBin, ...common, '--apply', '--path', run.target.arg],
      {cwd: run.target.cwd},
    );
    if (applied.status !== 0) {
      fail([
        `Applying codemods to ${run.path} failed (exit ${applied.status}).`,
        'Some files may already be rewritten — `git diff` shows exactly which.',
        'Finish by hand or re-run past the failing codemod with',
        '`astryx upgrade --skip-codemod <name>`, then re-run this script.',
        '',
        applied.output.trim(),
      ]);
    }
    run.applied = applied.output.trim();
  }
  ok(`codemods applied to ${pending.length} of ${runs.length} source trees`);
  return runs;
}

async function confirm(question) {
  if (!process.stdin.isTTY) {
    warn('not a terminal, so nothing can be confirmed here — pass --yes');
    return false;
  }
  const rl = createInterface({input: process.stdin, output: process.stdout});
  try {
    const answer = await rl.question(`\n  ${question} [y/N] `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

/**
 * What the published package weighs, packed and unpacked.
 *
 * Vendoring makes the upstream release a visible part of Tecton's own download
 * size (`docs/engineering/build-pipeline.md` step 8), so an upgrade that adds a
 * megabyte to every consumer's install should say so out loud.
 */
function measurePackage() {
  if (!fs.existsSync(path.join(REACT, 'dist', 'index.js'))) return null;
  const packed = sh('npm', ['pack', '--dry-run', '--json'], {
    cwd: REACT,
    quiet: true,
  });
  if (packed.status !== 0) return null;
  try {
    const start = packed.output.indexOf('[');
    const [entry] = JSON.parse(packed.output.slice(start));
    return {
      packed: entry.size,
      unpacked: entry.unpackedSize,
      files: entry.entryCount,
      vendor: directorySize(path.join(REACT, 'dist', 'vendor')),
    };
  } catch {
    return null;
  }
}

function directorySize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? directorySize(full) : fs.statSync(full).size;
  }
  return total;
}

const mb = bytes => `${(bytes / 1e6).toFixed(1)} MB`;

/** The token names a built theme.css sets, the way the build counts them. */
function builtThemeTokens() {
  const file = path.join(REACT, 'dist', 'theme', 'theme.css');
  if (!fs.existsSync(file)) return null;
  const css = fs.readFileSync(file, 'utf8');
  const names = new Set();
  for (const match of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g))
    names.add(match[1]);
  return [...names].sort();
}

/** 5 — rebuild everything that is derived from the upstream release. */
function regenerate(options) {
  step('Regenerating what the upstream release feeds');

  if (options.dryRun) {
    note('--dry-run: not rebuilding the package');
    return {
      manifest: {added: [], removed: [], updated: false},
      warnings: [],
      size: {before: null, after: null},
      buildOutput: '',
    };
  }

  const manifestFile = path.join(REACT, 'theme-token-manifest.json');
  const before = new Set(readJson(manifestFile).tokens ?? []);
  // Measured while `dist/` is still the last build, i.e. the old release.
  const sizeBefore = measurePackage();

  // The subpath modules come straight out of the new release's exports map,
  // and the README's module list out of the package's. Both have to be written
  // BEFORE the build, which checks them for drift and would otherwise stop at
  // the first one the new release moved. The diff they leave in the tree is
  // the record of what the release added, moved or removed.
  for (const script of ['generate-modules.mjs', 'generate-readme.mjs']) {
    mustRun(process.execPath, [path.join(REACT, 'scripts', script)], {
      cwd: REACT,
    });
  }

  // The theme build is the rest of it: the new CLI compiles the theme, the
  // token coverage is checked against the committed manifest, and the patched
  // upstream dist is re-vendored and re-asserted.
  let build = sh(process.execPath, [path.join(REACT, 'scripts', 'build.mjs')], {
    cwd: REACT,
  });

  const warnings = [...build.output.matchAll(/^.*(?:warning|deprecat|⚠).*$/gim)]
    .map(match => match[0].trim())
    .filter((line, index, all) => all.indexOf(line) === index);

  let added = [];
  let removed = [];
  let updated = false;

  if (build.status !== 0) {
    const coverage =
      /no longer sets the tokens in theme-token-manifest\.json/.test(
        build.output,
      );
    if (!coverage) {
      fail([
        `The package build failed (exit ${build.status}).`,
        'Nothing downstream of it has been regenerated. The output above is the',
        'whole story; the build stops at the first step that cannot finish.',
      ]);
    }

    // The token SET moved. That is a cross-container contract, so it is shown
    // before it is re-pinned, never after.
    removed = readList(build.output, /missing \(\d+\): ([^\n]+)/);
    added = readList(build.output, /unexpected \(\d+\): ([^\n]+)/);

    console.log('');
    warn("the theme no longer sets exactly the manifest's token set:");
    for (const name of added) {
      note(
        `  + ${name}  (TODO: the new release has it, Tecton did not set it before)`,
      );
    }
    for (const name of removed) {
      note(`  − ${name}  (Tecton set it; the new release no longer knows it)`);
    }
    console.log('');
    note('re-pinning the manifest now that the diff above is on the record');

    build = sh(
      process.execPath,
      [path.join(REACT, 'scripts', 'build.mjs'), '--update-manifest'],
      {cwd: REACT},
    );
    if (build.status !== 0) {
      fail([
        `The package build still fails with --update-manifest (exit ${build.status}).`,
        'The token diff above is not the only thing wrong.',
      ]);
    }
    updated = true;
  }

  const after = builtThemeTokens();
  if (after && !updated) {
    added = after.filter(name => !before.has(name));
    removed = [...before].filter(name => !after.includes(name)).sort();
  }
  ok(`@tecton/react rebuilt on ${CORE} (${after?.length ?? '?'} theme tokens)`);

  // The palette and the icons are generated from the design delivery rather
  // than from upstream, so drift here means the upgrade moved something it
  // should not have. Check first, regenerate only if it really moved.
  const generators = [
    ['palette', 'generate-palette.mjs'],
    ['icons', 'generate-icons.mjs'],
  ];
  const regenerated = [];
  for (const [name, script] of generators) {
    const file = path.join(REACT, 'scripts', script);
    const check = sh(process.execPath, [file, '--check'], {
      cwd: REACT,
      quiet: true,
    });
    if (check.status === 0) {
      ok(`${name}: up to date`);
      continue;
    }
    warn(`${name}: drifted — regenerating`);
    mustRun(process.execPath, [file], {cwd: REACT});
    mustRun(process.execPath, [file, '--check'], {cwd: REACT});
    regenerated.push(name);
  }

  // The documentation site's examples and page templates are ported from the
  // new release's own showcase blocks, so they move with it. The port script
  // belongs to the documentation site; if it is not there, say so rather than
  // failing the upgrade — everything the package needs is already done.
  const portScript = path.join(
    ROOT,
    'apps',
    'docs',
    'scripts',
    'port-examples.mjs',
  );
  if (fs.existsSync(portScript)) {
    mustRun(process.execPath, [portScript], {cwd: ROOT});
    regenerated.push('ported examples');
  } else {
    warn(
      'apps/docs/scripts/port-examples.mjs is not in the tree — the examples ' +
        'and page templates were NOT re-ported from the new release. Run it ' +
        'yourself once it is there, or the documentation site will show the ' +
        "previous release's code.",
    );
  }

  const sizeAfter = measurePackage();
  if (sizeAfter) {
    note(
      `packed ${mb(sizeAfter.packed)}, unpacked ${mb(sizeAfter.unpacked)} ` +
        `(vendored upstream: ${mb(sizeAfter.vendor)})`,
    );
  }

  return {
    manifest: {added, removed, updated},
    warnings,
    regenerated,
    size: {before: sizeBefore, after: sizeAfter},
    buildOutput: build.output,
  };
}

function readList(text, pattern) {
  const match = pattern.exec(text);
  if (!match) return [];
  return match[1]
    .split(',')
    .map(name => name.trim())
    .filter(Boolean)
    .sort();
}

/** 6 — the report. */
function writeReport(context) {
  step('Writing the report');
  const {from, to, options, inventories, runs, regeneration, astryx} = context;

  fs.mkdirSync(REPORT_DIR, {recursive: true});
  const file = path.join(REPORT_DIR, `${from}-to-${to}.md`);

  const components = diffAgainstSnapshot('components', inventories.components);
  const targets = diffAgainstSnapshot('targets', inventories.targets);
  const tokens = diffAgainstSnapshot('tokens', inventories.tokens);

  // Which of the tokens the release grew does Tecton not set? Those are the
  // TODOs: an unset token falls through to the upstream default, and under one
  // shared theme name that default is shared with every other Tecton on the page.
  const themeTokens = new Set(
    readJson(path.join(REACT, 'theme-token-manifest.json')).tokens ?? [],
  );
  const unsetNewTokens = tokens.added.filter(name => !themeTokens.has(name));

  const imports = wrapperImports();
  const unresolved = imports.filter(
    hit => !resolvesInExports(astryx, hit.specifier),
  );
  const removedComponents = new Set(components.removed);
  const orphanedWrappers = imports
    .map(hit => ({
      ...hit,
      gone: hit.names.filter(name => removedComponents.has(name)),
    }))
    .filter(hit => hit.gone.length > 0);

  const sections = changelogSections(astryx);
  const [low, high] = compareVersions(to, from) < 0 ? [to, from] : [from, to];
  const inRange = sections.filter(
    entry =>
      compareVersions(entry.version, low) > 0 &&
      compareVersions(entry.version, high) <= 0,
  );

  /**
   * A diff is only the release's news when its baseline is the release being
   * left behind. A snapshot from some other version (a run that stopped before
   * step 9, a snapshot refreshed by hand) still produces a diff — just not the
   * one the heading promises — so the report says which version it is against
   * and calls it out when that is not `from`.
   */
  const baselineNote = diff =>
    diff.baseline && diff.baseline !== from
      ? `\n> **The snapshot this is against was taken at \`${diff.baseline}\`, not at \`${from}\`**, so what follows is the difference from _that_ version. Re-run \`pnpm snapshot:astryx\` on \`${from}\` before trusting it as this upgrade's news.\n`
      : '';

  const list = (names, empty) =>
    names.length === 0
      ? `_${empty}_`
      : names.map(name => `- \`${name}\``).join('\n');

  const body = [
    `# ${CORE} ${from} → ${to}`,
    '',
    `Written by \`scripts/upgrade-astryx.mjs\` on ${new Date().toISOString().slice(0, 10)}.`,
    '',
    '| | |',
    '| --- | --- |',
    `| From | \`${CORE}@${from}\` |`,
    `| To | \`${CORE}@${to}\` |`,
    `| Direction | ${compareVersions(to, from) < 0 ? 'downgrade' : compareVersions(to, from) === 0 ? 're-run at the same version' : 'upgrade'} |`,
    `| Command | \`pnpm upgrade-astryx --to ${options.to}${options.dryRun ? ' --dry-run' : ''}${options.force ? ' --force' : ''}${options.skipChecks ? ' --skip-checks' : ''}\` |`,
    `| Patch | \`patches/${CORE.replace('/', '__')}@${to}.patch\` — ${options.dryRun ? 'not applied (dry run)' : 'applied by `pnpm install`'} |`,
    `| Checks | ${options.dryRun ? 'not run (dry run)' : options.skipChecks ? 'skipped (`--skip-checks`)' : '`pnpm check`, `pnpm check:mfe`'} |`,
    '',
    options.dryRun
      ? `> **Dry run.** Nothing in the repository was changed. The inventories below\n> come from a scratch install of ${to} under \`node_modules/.cache\`; the theme,\n> the token manifest and the checks were not run at all.`
      : '',
    '',
    '## Changelog',
    '',
    inRange.length === 0
      ? `_The CHANGELOG of the installed release (\`${astryx.version}\`) has no \`# <version>\` section between ${from} and ${to}. For a downgrade that is expected: the older release's changelog cannot describe the newer one being undone — read \`${high}\`'s own notes for that._`
      : inRange
          .map(entry => `### ${entry.version}\n\n${entry.body}`)
          .join('\n\n'),
    '',
    '## Codemods',
    '',
    runs.newCodemods?.length
      ? `Codemods \`${to}\` ships that the installed release does not:\n\n${runs.newCodemods
          .map(
            entry =>
              `- \`${entry.name}\` — ${entry.title}${entry.optional ? ' _(optional)_' : ''}`,
          )
          .join('\n')}\n`
      : '',
    runs.length === 0
      ? '_No source tree was scanned._'
      : runs
          .map(run =>
            [
              `### \`${run.path}\`${run.skipped ? ' — skipped' : run.applied ? ' — applied' : ' — dry run only'}`,
              '',
              run.skipped
                ? 'No upstream package resolves from this workspace, so there is no upstream API here to migrate.'
                : '',
              '```',
              (run.applied ?? run.preview) || '(no output)',
              '```',
            ]
              .filter(Boolean)
              .join('\n'),
          )
          .join('\n\n'),
    '',
    '## Theme build',
    '',
    options.dryRun
      ? '_Not run: a dry run does not install the release, so the theme was not recompiled and the token manifest was not checked against it. The two sections below are therefore empty by construction — run without `--dry-run` to find out what the new release does to them._'
      : regeneration.warnings?.length
        ? ['```', ...regeneration.warnings, '```'].join('\n')
        : '_No warnings from the theme build._',
    regeneration.regenerated?.length
      ? `\nRegenerated after drift: ${regeneration.regenerated.join(', ')}.`
      : '',
    '',
    '## Package size',
    '',
    regeneration.size?.after
      ? [
          'Vendoring puts the upstream release inside the published package, so its size is part of Tecton\u2019s.',
          '',
          '| | packed | unpacked | files | of which vendored |',
          '| --- | --- | --- | --- | --- |',
          regeneration.size.before
            ? `| before (\`${from}\`) | ${mb(regeneration.size.before.packed)} | ${mb(regeneration.size.before.unpacked)} | ${regeneration.size.before.files} | ${mb(regeneration.size.before.vendor)} |`
            : '| before | _not measured — nothing in `dist/`_ | | | |',
          `| after (\`${to}\`) | ${mb(regeneration.size.after.packed)} | ${mb(regeneration.size.after.unpacked)} | ${regeneration.size.after.files} | ${mb(regeneration.size.after.vendor)} |`,
        ].join('\n')
      : '_Not measured (the package was not rebuilt)._',
    '',
    '## Token manifest',
    '',
    options.dryRun
      ? '_Not checked (dry run)._'
      : regeneration.manifest.updated
        ? '`theme-token-manifest.json` was re-pinned with `--update-manifest`, after the diff below. Token coverage is a cross-container contract: every Tecton version on a page must cover the same set, so this belongs in the release notes.'
        : '`theme-token-manifest.json` was unchanged: the rebuilt theme sets exactly the tokens it already pinned.',
    '',
    '**Added** — the new release makes the theme set these, and no Tecton before this one did:',
    '',
    list(regeneration.manifest.added, 'none'),
    '',
    '**Removed** — Tecton set these and the new release no longer knows them; the theme build above is where it said so:',
    '',
    list(regeneration.manifest.removed, 'none'),
    '',
    `### The release's own token surface (vs the ${tokens.baseline ?? 'missing'} snapshot)`,
    '',
    `Added: ${tokens.added.length} · removed: ${tokens.removed.length} · total: ${inventories.tokens.length}`,
    baselineNote(tokens),
    '',
    '**Declared by this release and not by the last one:**',
    '',
    list(tokens.added, 'no new tokens upstream'),
    '',
    unsetNewTokens.length > 0
      ? `**TODO — new upstream tokens Tecton does not set.** Each one falls through to the upstream default, which under one shared theme name is shared with every other Tecton version on the page:\n\n${list(unsetNewTokens, 'none')}`
      : '_Every token the release added is already covered by the Tecton theme, or none were added._',
    '',
    '**No longer declared by this release:**',
    '',
    list(tokens.removed, 'no tokens dropped upstream'),
    '',
    '## Component inventory',
    '',
    `Against \`scripts/astryx-snapshot/components.json\` (${components.baseline ?? 'no snapshot'}) — ${inventories.components.length} components now.`,
    baselineNote(components),
    '',
    '**New:**',
    '',
    list(components.added, 'none'),
    '',
    '**Removed:**',
    '',
    list(components.removed, 'none'),
    '',
    '## Theme targets',
    '',
    `Against \`scripts/astryx-snapshot/targets.json\` (${targets.baseline ?? 'no snapshot'}) — ${inventories.targets.length} targets now.`,
    baselineNote(targets),
    '',
    '**New:**',
    '',
    list(targets.added, 'none'),
    '',
    '**Removed:**',
    '',
    list(targets.removed, 'none'),
    '',
    '## Tecton modules',
    '',
    `${imports.length} upstream imports across \`packages/react/src\` — the generated subpath modules, the provider and the theme.`,
    '',
    unresolved.length === 0
      ? "✓ Every `@astryxdesign/core/<X>` specifier still resolves through the release's own `exports` map."
      : `**${unresolved.length} specifiers no longer resolve.** The build fails on these:\n\n${unresolved
          .map(hit => `- \`${hit.specifier}\` — ${hit.file}`)
          .join('\n')}`,
    '',
    orphanedWrappers.length === 0
      ? '✓ No Tecton module names a component this release removed or renamed.'
      : `**Modules whose upstream component is gone:**\n\n${orphanedWrappers
          .map(
            hit =>
              `- ${hit.component ? `\`${hit.component}\`` : hit.file} — imports ${hit.gone
                .map(name => `\`${name}\``)
                .join(', ')} from \`${hit.specifier}\``,
          )
          .join('\n')}`,
    '',
    '## Next steps',
    '',
    '1. Read this report, the changelog above first.',
    '2. Look at `git diff` — the pins, the patch file name, any codemod edits, the regenerated theme.',
    '3. Any TODO in the token section is a theme change, not an upgrade change: land it separately.',
    options.skipChecks && !options.dryRun
      ? '4. Run `pnpm check` and `pnpm check:mfe` — this run skipped them.'
      : '4. Commit, with the token-coverage note in the message if the manifest moved.',
    '',
  ]
    .filter(line => line !== undefined)
    .join('\n');

  fs.writeFileSync(file, `${body.replace(/\n{3,}/g, '\n\n')}`, 'utf8');

  // Generated files are formatted by their generator here, so `pnpm format`
  // and `pnpm format:check` never disagree about one — and `pnpm check`, which
  // this run is about to call, starts with `format:check`.
  const prettier = path.join(ROOT, 'node_modules', '.bin', 'prettier');
  if (fs.existsSync(prettier)) {
    const formatted = sh(prettier, ['--write', path.relative(ROOT, file)], {
      quiet: true,
    });
    if (formatted.status !== 0) {
      warn(`prettier could not format the report: ${formatted.output.trim()}`);
    }
  }
  ok(`${path.relative(ROOT, file)} written`);
  return {file, components, targets, tokens, unresolved, orphanedWrappers};
}

/** 7 — the repository's own checks. */
function runChecks(options) {
  step('Checks');
  if (options.dryRun) {
    note('--dry-run: not running the checks');
    return;
  }
  if (options.skipChecks) {
    warn('--skip-checks: `pnpm check` and `pnpm check:mfe` were NOT run');
    return;
  }
  mustRun('pnpm', ['check'], {
    stream: true,
    hint: ['`pnpm check` is the acceptance test for everything above it.'],
  });
  ok('pnpm check');
  mustRun('pnpm', ['check:mfe'], {
    stream: true,
    hint: [
      "The four harness assertions are the upgrade's acceptance test for the",
      `two upstream patches specifically — see ${PATCH_DOC}.`,
    ],
  });
  ok('pnpm check:mfe');
}

// ---------------------------------------------------------------------------
// The scratch install a dry run reports from
// ---------------------------------------------------------------------------

function scratchInstall(version) {
  const dir = path.join(SCRATCH, version);
  const manifest = path.join(dir, 'package.json');
  const installed = () => {
    try {
      return astryxAt(dir).version === version;
    } catch {
      return false;
    }
  };
  if (!installed()) {
    fs.mkdirSync(dir, {recursive: true});
    writeJson(manifest, {
      name: 'astryx-upgrade-preview',
      private: true,
      version: '0.0.0',
      dependencies: {[CORE]: version, [CLI]: version},
    });
    note(
      `installing ${CORE}@${version} into ${path.relative(ROOT, dir)} to report from`,
    );
    const result = sh(
      'npm',
      ['install', '--silent', '--no-audit', '--no-fund', '--ignore-scripts'],
      {cwd: dir},
    );
    if (result.status !== 0 || !installed()) {
      fail([
        `Could not install ${CORE}@${version} into the scratch directory, so a`,
        'dry run cannot say what the release contains.',
        result.output.trim(),
      ]);
    }
  }
  ok(`reporting from a scratch install of ${version}`);
  return astryxAt(dir);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.snapshot) {
    step('Snapshotting the pinned release');
    const astryx = astryxAt(REACT);
    refreshSnapshots(astryx, takeInventories(astryx));
    ok(`snapshots re-pinned at ${CORE}@${astryx.version}`);
    return;
  }

  console.log(`\n  Tecton · upgrading ${CORE}`);
  const versions = preflight(options);
  bumpPins(versions, options);
  install(options, versions);

  // Which installation the rest of the run reads from: the workspace's, or —
  // in a dry run, where nothing was installed — a scratch copy of the target.
  const astryx = options.dryRun
    ? (step('Fetching the target release'), scratchInstall(versions.to))
    : astryxAt(REACT);

  if (!options.dryRun && astryx.version !== versions.to) {
    fail([
      `The install resolved ${CORE}@${astryx.version}, not ${versions.to}.`,
      'Something else in the workspace is pinning it; fix that before going on.',
    ]);
  }

  const runs = await codemods(options, versions, astryx, astryxAt(REACT));
  const regeneration = regenerate(options);
  const inventories =
    (step('Reading the release inventories'), takeInventories(astryx));
  ok(
    `${inventories.components.length} components, ${inventories.targets.length} theme targets, ` +
      `${inventories.tokens.length} tokens`,
  );

  const report = writeReport({
    from: versions.from,
    to: versions.to,
    options,
    inventories,
    runs,
    regeneration,
    astryx,
  });

  runChecks(options);

  step('Snapshots');
  if (options.dryRun) {
    note('--dry-run: the committed snapshots are left at the current pin');
  } else {
    refreshSnapshots(astryx, inventories);
  }

  console.log(`\n${RULE}`);
  console.log(
    `  ${CORE} ${versions.from} → ${versions.to}${options.dryRun ? ' (dry run)' : ''}`,
  );
  console.log(RULE);
  console.log(`  report                 ${path.relative(ROOT, report.file)}`);
  console.log(
    `  components             +${report.components.added.length} / −${report.components.removed.length}`,
  );
  console.log(
    `  theme targets          +${report.targets.added.length} / −${report.targets.removed.length}`,
  );
  console.log(
    `  upstream tokens        +${report.tokens.added.length} / −${report.tokens.removed.length}`,
  );
  console.log(
    `  theme token manifest   +${regeneration.manifest.added.length} / −${regeneration.manifest.removed.length}` +
      `${regeneration.manifest.updated ? ' (re-pinned)' : ''}`,
  );
  console.log(
    `  upstream imports       ${report.unresolved.length} unresolved, ${report.orphanedWrappers.length} on removed components`,
  );
  console.log('');
  console.log('  Next: read the report, then `git diff`, then commit.');
  if (options.dryRun) {
    console.log('  Nothing was changed — this was a dry run.');
  } else if (options.skipChecks) {
    console.log(
      '  `pnpm check` and `pnpm check:mfe` were skipped: run them before committing.',
    );
  }
  console.log('');
}

try {
  await main();
} catch (error) {
  if (error instanceof StepError) {
    console.error(`\n${RULE}`);
    console.error(`  FAILED in step ${stepNumber} — ${error.step}`);
    console.error(RULE);
    console.error(
      error.message
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n'),
    );
    console.error('');
    process.exit(1);
  }
  throw error;
}
