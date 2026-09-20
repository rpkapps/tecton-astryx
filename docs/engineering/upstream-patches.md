# Upstream patches

Tecton is built on a third-party component library that is installed exactly
pinned (`@astryxdesign/core@0.6.2`). Two of its modules keep page-level state in
module scope, which is correct for one copy on a page and wrong for two. Both
are patched here, with `pnpm patch`, and both patches are **proposed upstream**
— the text to send is at the bottom of this document.

```
patches/@astryxdesign__core@0.6.2.patch       the patch itself, committed
package.json  → pnpm.patchedDependencies      what makes pnpm apply it
```

| File                          | Lines      | Fixes            |
| ----------------------------- | ---------- | ---------------- |
| `src/hooks/useScrollLock.ts`  | +53 / −9   | F1 (**S1**)      |
| `dist/hooks/useScrollLock.js` | +44 / −9   | the shipped copy |
| `src/Layer/layerStack.ts`     | +132 / −57 | F6, F7           |
| `dist/Layer/layerStack.js`    | +112 / −56 | the shipped copy |

Both the built `dist/` module and the readable `src/` module are patched, so
the code that runs and the code an engineer reads never disagree. Only `dist/`
is executed; `src/` is what the package ships for source maps and for reading.

---

## Why a patch and not a wrapper mitigation

`docs/engineering/micro-frontends/mitigation-proposal.md` §4 and §5 reached the
same conclusion twice: a wrapper can only coordinate the document-level state it
is in the call path for. `useScrollLock`'s counter and `layerStack`'s entry list
are module-private with no registration API, so no amount of wrapper code can
make two copies share one. The corrective mitigations that were designed instead
— a scroll-lock watchdog that repairs the body after the fact, a modal registry
that forbids the state in which the bug happens — are strictly worse than the
five-line fix each module actually needs, and neither removes the defect for a
consumer who reaches past Tecton to the library underneath.

Both patches use the shape upstream already uses for its interaction-modality
store (`src/utils/interactionModality.ts`): a lazily created record on
`document`, keyed by `Symbol.for(...)`, installed with `Object.defineProperty`
so whichever copy creates it owns it for the document's lifetime. That makes the
record's shape a permanent cross-version contract, which is why the keys are
versioned (`/v1`) and every record carries a `version` field.

---

## Patch 1 — `useScrollLock` keys its counter and snapshot on `document`

**Key:** `Symbol.for('@astryxdesign/core/scroll-lock/v1')`
**Store:** `{version, lockCount, originalBodyState}`

### What it changes

`lockCount` and `originalBodyState` were module-level `let`s. They now live in a
store on `document`, created on first lock. Nothing else moves: the same
snapshot is taken on the 0 → 1 transition, the same styles are restored on the
1 → 0 transition, the same scrollbar gutter is held. For one copy on a page the
behaviour is identical, instruction for instruction.

### The failure it removes

F1 in [`micro-frontends/analysis.md`](./micro-frontends/analysis.md), the one
**S1** defect in the whole investigation. With two copies:

1. Container A opens a modal. A's copy counts 1, snapshots the body's real
   styles, pins the body: `position: fixed; top: -300px`.
2. Container B opens a modal. B's copy counts 1 — its own counter, starting at
   zero — and snapshots **the already pinned body** as "original".
3. A's modal closes. A's counter hits 0 and restores the body to its pristine
   snapshot: the page scrolls freely behind B's still-open modal.
4. B's modal closes. B's counter hits 0 and restores the body to _its_ snapshot
   — the pinned one. The page is left `position: fixed; top: -300px` with
   nothing open, and stays unscrollable for the rest of its life.

With one counter and one snapshot per document, step 2 increments to 2, step 3
decrements to 1 and touches nothing, and step 4 restores the genuinely pristine
styles.

**Asserted by** `fixtures/consumers/mfe-harness/tests/mfe.spec.ts`:

- `two containers, one scroll lock: the body is restored only when the last modal closes`
- `the scroll lock survives the containers closing in the other order`

Both fail on unpatched code — verified by vendoring the unpatched modules and
re-running the harness.

---

## Patch 2 — `layerStack` keys its entries and its listener on `document`

**Key:** `Symbol.for('@astryxdesign/core/layer-stack/v1')`
**Store:** `{version, entries, seqByToken, nextSeq, isListening, isComposing, onKeyDown, onCompositionStart, onCompositionEnd}`

### What it changes

The entry array, the registration-order counter (`seqByToken` / `nextSeq`), the
composition flag and the `isListening` flag move into the document store. The
document listeners move with them: they are created once, by whichever copy
creates the store, and kept in the record so any copy can attach or detach
exactly those functions. `registerLayer`, `isTopmostLayer`, `isTextComposing`,
`dispatchLayerEscapeKeyDown` and `resetLayerStackForTests` keep their exact
signatures and semantics; each one now reads the shared store instead of module
scope.

Cross-copy dispatch needs nothing special: an entry is a plain object carrying
its own `dismiss`, `isPresent` and `getContainer` callbacks, so the listener
installed by copy A calling copy B's `dismiss` is an ordinary function call. The
`depth` → DOM-containment → `seq` comparator is untouched — it was always
correct; it simply could not see the other copy's entries.

The contract the upstream tests describe (`src/Layer/useLayerDismissal.test.tsx`
and `src/Layer/layerDismissalInvariants.test.tsx`) is unchanged for a single
copy: one Escape dismisses exactly one layer, the top-most one; `'block'`
swallows the press without dismissing; a re-registered layer keeps its place;
`isPresent` is asked at press time; a composing Escape is claimed but dismisses
nothing; the listener is attached with the first entry and detached with the
last. SSR keeps working: with no `document`, the module falls back to a
module-local store that no listener is ever attached to.

### The failures it removes

F6 and F7 in the analysis. Each copy had its own stack **and its own document
listener**, and the first listener to be attached is the first to run. The
second copy then stood down on the already-`defaultPrevented` press. So exactly
one layer closed — but the one chosen was "whichever copy attached its listener
first", not the one on top:

- a dialog in A and a menu opened over it from B: Escape closed **A's dialog**
  and left B's menu open, floating over nothing;
- a layer nested into another container's DOM was orphaned the same way.

With one stack the comparator ranks every entry on the page and the press goes
to the layer that is actually on top.

**Asserted by** `fixtures/consumers/mfe-harness/tests/mfe.spec.ts`:

- `one Escape dismisses the layer on top, whichever container opened it`
- `one Escape dismisses the layer on top with the containers the other way round`

The first fails on unpatched code. The second **passes** on unpatched code, and
that is the point of keeping it: with the containers the other way round the
first-attached listener happened to own the top layer, so the old behaviour was
right by luck. A pair of tests that only ever agree by accident is how the
failure hid.

---

## How the patch is applied, and how it reaches consumers

**In this repository:** `pnpm install` applies it. `pnpm.patchedDependencies` in
the root `package.json` points at the committed patch file; pnpm re-applies it
to the store copy on every install, so a fresh clone, a lockfile change and CI
all get the patched package with no extra step. Nothing else is needed, and
nothing should be edited in `node_modules` by hand.

**For consumers:** a patch applies to _this workspace's_ install, and a consumer
resolving their own copy of the upstream package would get the unpatched one. So
`@tecton/react` does not depend on the upstream package at all: the build
**vendors the patched code into `dist/vendor/core/`** and rewrites every
upstream import to a relative path into it (step 8 in
`packages/react/scripts/build.mjs`, described in
[`build-pipeline.md`](./build-pipeline.md)). Consumers install `@tecton/react`
and nothing else; there is no `@astryxdesign` directory in their `node_modules`,
and therefore no way for them to end up with an unpatched copy.

Two build assertions keep that honest, and both fail the build loudly:

- `dist/vendor/core/dist/hooks/useScrollLock.js` and
  `dist/vendor/core/dist/Layer/layerStack.js` must contain their `Symbol.for`
  keys. An install that skipped the patch vendors upstream's own modules, and
  this is what catches it.
- no module position anywhere in `dist/` — compiled JS or emitted `.d.ts` — may
  name `@astryxdesign/*`.

---

## When a new upstream release fails to apply the patch

`pnpm install` fails with `ERR_PNPM_PATCH_NOT_APPLIED` (or a failed hunk) as
soon as the pinned version moves and the patched files have changed. That is the
intended behaviour: it is a release-blocking signal, not a nuisance. The order to
work through it:

1. **Check whether the fix landed upstream.** Read the new release's changelog
   and the two modules. If `useScrollLock` or `layerStack` now keys its state on
   `document` itself, **delete that half of the patch** (and the whole file and
   the `pnpm.patchedDependencies` entry if both landed), and keep the harness
   assertions exactly as they are — they now protect upstream's own fix.
2. **Otherwise, re-create the patch against the new version.** Do not hand-edit
   the `.patch` file:

   ```bash
   pnpm patch @astryxdesign/core@<new version>
   # edit the four files in the printed directory, following this document
   pnpm patch-commit '<printed directory>'
   ```

   The new patch file is named after the new version; delete the old one and let
   the `pnpm.patchedDependencies` key move with it.

3. **Re-apply by hand in this order**, because the four files are two changes,
   not four: patch `src/hooks/useScrollLock.ts` and mirror it into
   `dist/hooks/useScrollLock.js`; then `src/Layer/layerStack.ts` and its `dist`
   mirror. The `dist` file is Babel output from the same source, so the mirror is
   mechanical — the same statements without the types.
4. **Verify before trusting it.** `pnpm --filter @tecton/react build` asserts the
   vendored code carries both keys; `pnpm check:mfe` re-runs the four assertions
   above in a browser, and they fail if either patch is half-applied.
5. **If the upstream module has been restructured beyond a mechanical
   re-apply**, stop and treat it as a design change rather than a rebase: the
   store shape is a cross-version contract (`/v1`), and a page can carry an old
   Tecton and a new one at the same time. A new shape needs a new key (`/v2`)
   **and** a story for what happens when both are on a page — which, for these
   two modules, means the two copies stop coordinating. Prefer keeping `/v1`.

---

## What `scripts/upgrade-astryx.mjs` must do (Phase 5, not yet implemented)

The upgrade script owns this flow end to end. It is not part of this phase; this
is the requirement list it has to satisfy:

1. Bump the exact pins in `packages/react/package.json`
   (`@astryxdesign/core` and `@astryxdesign/cli`, both `devDependencies` now) —
   they remain the single source of truth for the upstream version.
2. Re-point `pnpm.patchedDependencies` at the new version's patch file and run
   `pnpm install`. **A failed patch application must be loud and must stop the
   run**, printing this document's path and the failing hunks; it must never be
   skipped, `--force`d, or silently dropped, because a silent drop ships the S1
   frozen-page defect to every consumer.
3. Regenerate everything downstream of the upstream version: the theme
   (`astryx theme build`), the token manifest diff, the icon and palette checks.
4. Rebuild `@tecton/react`, which re-vendors the patched `dist` and re-runs the
   patch-marker and no-bare-import assertions.
5. Run `pnpm check` and `pnpm check:mfe`. The four harness assertions listed
   above are the upgrade's acceptance test for the patches specifically.
6. Report the packed size before and after: vendoring makes the upstream release
   a visible part of Tecton's own download size.

---

## Upstream proposal 1 — key the scroll lock on `document`

> **`useScrollLock`: keep the lock count and the body snapshot on `document`**
>
> `useScrollLock` keeps `lockCount` and `originalBodyState` in module scope. On
> a page where two copies of `@astryxdesign/core` are loaded — a micro-frontend,
> or an application part-way through a version migration — each copy counts only
> its own locks, and the result is a page that can be left permanently
> unscrollable:
>
> 1. A modal from copy A pins the body and snapshots its real styles.
> 2. A modal from copy B snapshots the **already pinned** body as its original.
> 3. A's modal closes: A's count hits 0 and unpins the body while B's modal is
>    still open — the background scrolls behind an open modal.
> 4. B's modal closes: B's count hits 0 and restores its snapshot, leaving
>    `position: fixed; top: -NNNpx` on the body with nothing open. The page never
>    scrolls again.
>
> Nothing outside the library can fix this: the counter and the snapshot are
> module-private, and a consumer-side watchdog can only repair the end state
> after the fact.
>
> The fix is the pattern `utils/interactionModality.ts` already uses: keep the
> state in a lazily created, `Symbol.for`-keyed record on `document`, installed
> with `Object.defineProperty`. Suggested key:
> `Symbol.for('@astryxdesign/core/scroll-lock/v1')`, with the record carrying
> `{version: 1, lockCount, originalBodyState}` so its shape is a versioned
> cross-copy contract. For a single copy the behaviour is unchanged: the same
> snapshot on the 0 → 1 transition, the same restore on 1 → 0, the same
> scrollbar-gutter hold. The hook only touches the store from inside its effect,
> so server rendering is unaffected.
>
> Patch attached (~50 lines, comments included). Happy to add a test that mounts
> the hook from two separately imported module instances if that shape suits the
> suite.

## Upstream proposal 2 — key the layer stack on `document`

> **`layerStack`: keep the entries, the sequence counter and the listener on
> `document`**
>
> `layerStack` keeps its entry array, its `seqByToken`/`nextSeq` registration
> order and its single `document` keydown listener in module scope. With two
> copies of the package on one page that becomes two stacks and two listeners.
> One Escape still dismisses exactly one layer — the `defaultPrevented` guard
> makes the second listener stand down — but the layer it dismisses is chosen by
> **which copy attached its listener first**, not by what is on top. Measured: a
> `Dialog` from copy A with a `DropdownMenu` opened over it from copy B; Escape
> closed the dialog and left the menu floating over nothing. The same mechanism
> orphans a layer that was rendered into another copy's subtree.
>
> The comparator is already right — `depth`, then DOM containment, then
> registration order picks the correct top-most layer. It simply cannot see the
> other copy's entries.
>
> The fix is the `interactionModality` pattern again: a lazily created,
> `Symbol.for`-keyed record on `document`, suggested key
> `Symbol.for('@astryxdesign/core/layer-stack/v1')`, holding
> `{version: 1, entries, seqByToken, nextSeq, isListening, isComposing}` plus
> the three listener functions, so the listener is installed once per document
> and any copy can detach exactly it. Entries are plain objects carrying their
> own `dismiss`/`isPresent`/`getContainer`, so dispatching into an entry another
> copy registered is an ordinary function call — no serialisation, no protocol.
>
> The public API and every documented behaviour are unchanged, and
> `useLayerDismissal.test.tsx` and `layerDismissalInvariants.test.tsx` pass
> as-is. Server rendering falls back to a module-local store with no listeners.
>
> Patch attached (~130 lines, comments included).

## A third ask, not yet decided

`<Theme rootSync={false}>`, or ref-counted `<html>` attributes upstream. Today
the theme provider writes `data-theme` and `data-astryx-theme` on mount and
removes them unconditionally on unmount, so the first container to unmount
strips them for the whole page. Tecton corrects this with its own document-keyed
registry (`packages/react/src/runtime/rootRegistry.ts`), which works but is
corrective: there is a one-microtask window in which a synchronous reader sees
the wrong value. This one has not been approved as a patch and is recorded here
so it is not forgotten.
