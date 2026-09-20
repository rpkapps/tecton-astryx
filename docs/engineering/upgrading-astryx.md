# Upgrading the upstream library

`@tecton/react` is built on a third-party component library that releases every
few days. `scripts/upgrade-astryx.mjs` is how this repository moves to a new
one: one command, nine steps, one report per upgrade.

```bash
pnpm upgrade-astryx --to 0.6.3          # a version
pnpm upgrade-astryx --to latest         # or a dist-tag
pnpm upgrade-astryx --to canary --dry-run
pnpm snapshot:astryx                    # just re-pin the inventories
```

| Flag            | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `--to <v>`      | the release to move to; a dist-tag is resolved against the registry |
| `--dry-run`     | change nothing, and write the report the upgrade _would_ write      |
| `--yes`         | apply codemods without asking                                       |
| `--skip-checks` | skip `pnpm check` and `pnpm check:mfe`                              |
| `--allow-dirty` | run with uncommitted changes in the tree                            |
| `--force`       | pass `--force` to the codemod runner (a downgrade needs it)         |
| `--snapshot`    | only refresh `scripts/astryx-snapshot/`, then stop                  |

It never commits and never pushes. Reviewing `git diff` and the report, and
then committing, is the human's half of the job.

## The steps

Each one prints a heading and fails on its own: a step that cannot finish stops
the run, says why in full, and leaves the tree where a person can pick it up.

1. **Preflight.** A clean git tree (or `--allow-dirty`), and a target the
   registry actually has — `npm view` decides, so a typo cannot get past here.
   The current pin is `packages/react`'s devDependency on the upstream package:
   that one entry is the repository's single source of truth for which upstream
   release Tecton is built against.
2. **Bump.** Every pin of `@astryxdesign/core`, `@astryxdesign/cli` (and
   `@astryxdesign/build`, if it ever appears) in every workspace manifest, plus
   the `pnpm.patchedDependencies` key — which carries the version in its name —
   and the patch file it points at, renamed with `git mv`.
3. **Install.** `pnpm install`, which is also where the patch is applied. **A
   failed patch stops the run**; see below.
4. **Codemods.** The upstream CLI's own migrations
   (`astryx upgrade --from <old> --apply`), over `packages/react/src`,
   `apps/docs/src` and each consumer fixture's `src`. The dry run is shown
   first and, without `--yes`, confirmed before anything is written. The runner
   refuses a `--path` outside its own project and finds the release by
   resolving from its working directory, so it runs once per workspace; a
   fixture with no upstream dependency is reported as skipped rather than
   silently passed over.
5. **Regenerate.** `packages/react/scripts/build.mjs` — the theme compiled with
   the new CLI, the token coverage checked, the patched upstream `dist`
   re-vendored — and then the palette and icon generators, which are checked
   first and only re-run if they really drifted. If the token _set_ moved, the
   diff is printed **before** `--update-manifest` re-pins it, never after.
6. **Inventories.** What the new release contains: components, theme targets
   and the tokens its own base stylesheet declares.
7. **Report.** `docs/engineering/upgrades/<old>-to-<new>.md`; see below.
8. **Checks.** `pnpm check` and `pnpm check:mfe`, unless `--skip-checks`. The
   four harness assertions are the upgrade's acceptance test for the two
   upstream patches specifically.
9. **Snapshots.** `scripts/astryx-snapshot/` is re-pinned at the new version,
   so the _next_ upgrade's report diffs against this one.

## Re-running it

The script is idempotent, and re-running it is the intended way to carry on
after a manual fix. Every step recognises work it has already done: pins that
are already at the target, a patch file that already moved, a manifest that
already matches. If the working tree is already bumped but `HEAD` is not, the
run reads the committed pin and treats itself as a resumed upgrade — so the
codemod range and the report's name stay those of the upgrade you started.

## When the patch does not apply

This is the one failure the script will not paper over. `pnpm install` fails as
soon as a new release changes the patched files, and step 3 stops there with
the full procedure from [`upstream-patches.md`](./upstream-patches.md) printed:
check whether the fix landed upstream (and delete that half of the patch if it
did), otherwise re-create it with `pnpm patch @astryxdesign/core@<new>` and
`pnpm patch-commit`, never by hand-editing the `.patch` file.

The pins and the patch file name are left **bumped** on purpose: that is the
state `pnpm patch` needs, and it is what the re-run picks up. A dropped patch
would ship the S1 frozen-page defect to every consumer, so it is never skipped,
never `--force`d and never silently downgraded to a warning.

## What the report contains

One file per upgrade, in `docs/engineering/upgrades/`, prettier-formatted by
the script so `pnpm format:check` stays quiet:

- the two versions, the direction, the exact command and whether the checks ran;
- the **changelog** sections between the two versions, read from the installed
  release's own `CHANGELOG.md`;
- the **codemods**, per source tree, with the runner's own output;
- **theme-build warnings** — deprecated theme targets and the like;
- the **token-manifest diff**: names added (the new release makes the theme set
  them) and removed (Tecton set them and the release no longer knows them),
  and, against the snapshot, the release's own new tokens with the ones Tecton
  does not set yet listed as TODOs. An unset token falls through to the
  upstream default, and under one shared theme name that default is shared with
  every other Tecton version on the page — which is why this is a diff and not
  a footnote;
- the **component inventory** and **theme-target** diffs against
  `scripts/astryx-snapshot/`;
- the **wrapper check**: every `@astryxdesign/core/<X>` import in
  `packages/react/src` resolved through the new release's own `exports` map,
  and any Tecton wrapper whose upstream component the release removed or
  renamed.

Two worked examples are committed:
[`0.6.2-to-0.6.1.md`](./upgrades/0.6.2-to-0.6.1.md) and
[`0.6.1-to-0.6.2.md`](./upgrades/0.6.1-to-0.6.2.md) — a real round trip, run to
prove the script end to end. A downgrade is the same mechanics as an upgrade;
it needs `--force` because the codemod runner refuses a backwards range, and
its changelog section is empty because the older release's changelog cannot
describe the newer one being undone.

## The snapshots

`scripts/astryx-snapshot/` holds three files, each recording the version it was
taken at:

| File              | From                              | Answers                            |
| ----------------- | --------------------------------- | ---------------------------------- |
| `components.json` | `astryx component --list --json`  | what components the release has    |
| `targets.json`    | `astryx theme targets --json`     | what a theme can override          |
| `tokens.json`     | the release's own base stylesheet | what token surface a theme can set |

They exist so an upgrade's report can say what _changed_ rather than what
exists. `pnpm snapshot:astryx` refreshes them from the installed release; the
upgrade script does it for you at the end of a successful run.

## Dry runs

`--dry-run` changes nothing in the repository. It resolves the target, installs
it into `node_modules/.cache/astryx-upgrade/<version>/` and reports from there,
so a canary can be inspected — new components, new theme targets, new tokens,
new codemods — without the workspace moving. The theme is not rebuilt and the
checks are not run, so the report says so in those sections rather than
implying an all-clear.
