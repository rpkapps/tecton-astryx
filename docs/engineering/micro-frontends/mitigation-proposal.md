# Phase 3 proposal: surviving several `@tecton/react` versions on one page

Concrete design for what `@tecton/react` should add. Every item below stays
inside what a **wrapper package** can do: no changes to `@astryxdesign/core`
source, no swizzle, no new consumer-facing dependency. Where a defect genuinely
needs an upstream change, it says so and stops — that decision needs user
approval, not a workaround that pretends to fix it.

Evidence for each claim is in `micro-frontends-analysis.md`; the harness that
produced it is in `harness/`.

---

## 0. The one rule the design follows

A wrapper cannot stop the upstream `Theme` from writing `<html>` attributes, cannot
reach into `useScrollLock`'s module state, and cannot merge two copies' layer
stacks. What it _can_ do is **own the outcome**: put the authoritative state in a
`Symbol.for`-keyed record on `document`, which every copy of the wrapper reaches,
and reconcile the DOM back to it. Upstream already uses exactly this pattern for
`interactionModality` (`Symbol.for('@astryxdesign/core/interaction-modality/v1')`,
measured present and shared), so it is a sanctioned shape rather than an
invention.

Two constraints on every such record, both measured:

- The upstream singleton is installed with `Object.defineProperty` and is
  **non-writable, non-configurable**. Whichever copy creates a record owns it for
  the document's lifetime, so the record's shape is a **permanent cross-version
  contract**. Version the key (`/v1`), carry a `version` field, and have newer
  copies tolerate an older record rather than replacing it.
- Copies that predate the record must not be broken by it. Every mitigation below
  degrades to today's behaviour when the record is absent or older.

---

## 1. `TectonRootRegistry` — ref-counted ownership of the document root

**Fixes F4** (any unmount strips `<html data-theme>` / `data-astryx-theme` for the
whole page, dropping hoisted layers to upstream defaults) and **F5** (mode
contention). **Prototyped and verified** — §12.1 of the analysis.

New internal module, not exported from the barrel:

```ts
// src/runtime/rootRegistry.ts
const KEY = Symbol.for('tecton.rootOwnership/v1');

export interface TectonRootClaim {
  /** Theme name to keep on <html data-astryx-theme>. */
  themeName: string;
  /** Mode to keep on <html data-theme>; 'system' removes it. */
  mode: TectonColorMode;
  /** Non-owning claims keep the attributes alive but do not choose them. */
  owning: boolean;
}

export interface TectonRootRegistry {
  readonly version: 1;
  /** Join; returns the release function. Callers own calling it. */
  acquire(claim: TectonRootClaim): () => void;
  /** Dev-only introspection; also what the dev warning reads. */
  inspect(): {
    holders: number;
    desired: TectonRootClaim | null;
    reassertions: number;
  };
}

export function getRootRegistry(): TectonRootRegistry | null; // null during SSR
```

Behaviour:

- `acquire` adds a claim and returns a release function. The **first owning
  claim** decides `desired`; later owning claims that disagree about `mode` or
  `themeName` log one dev warning naming both values and do not take over.
  First-wins rather than last-wins is the whole point: a container that mounts
  later must not restyle the page chrome out from under one that was already
  there.
- On the first claim, attach a `MutationObserver` to `document.documentElement`
  with `attributeFilter: ['data-theme', 'data-astryx-theme']`. When the DOM
  disagrees with `desired` and at least one claim is live, write `desired` back
  and bump `reassertions`. An `applying` flag suppresses self-triggering.
- On the last release, disconnect and remove both attributes — so a page that
  unmounts every container is left clean. Measured: `{"dataTheme":null,
"dataAstryxTheme":null}` after both containers release.
- Non-owning claims (`owning: false`) count for the ref count only. That is how
  `scope="nested"` keeps a sibling's unmount from stripping the attributes
  without itself trying to choose them.

**What it cannot fix.** It cannot stop the upstream `Theme` writing first — there
is a one-microtask window where `<html>` is wrong. `MutationObserver` callbacks
run at the microtask checkpoint, before paint, so nothing flashes, but a
synchronous read taken from another script inside that window sees the stale
value. It also does not cover a non-Tecton Astryx consumer on the same page,
which will keep fighting over the attributes.

**Needs Astryx changes?** No.

---

## 2. `TectonProvider` gains `scope` — root vs nested semantics

**Fixes F5**, and is the API surface for §1. Small, additive, default-compatible.

```ts
export type TectonColorMode = 'dark' | 'light' | 'system';

export interface TectonProviderProps {
  children: ReactNode;
  /** @default 'dark' */
  mode?: TectonColorMode;
  /**
   * Who owns page-level state — the <html> attributes, the scroll lock and the
   * toast viewport.
   *
   * - 'root'   (default) this provider is the page's Tecton root.
   * - 'nested' a host shell or another container already owns the page. The
   *            tree is still fully themed; this provider just does not try to
   *            decide the page's mode or theme name, and renders no toast
   *            viewport of its own.
   *
   * Containers deployed into a host shell that already calls
   * `configureTectonRoot()` should pass 'nested'.
   */
  scope?: 'root' | 'nested';
  /** Toast placement for this container. Ignored when scope is 'nested'. */
  toast?: {position?: TectonToastPosition};
}
```

`scope` does **not** change the upstream `Theme`'s own nesting detection — the
`ThemeNestingContext` that decides it is internal and unexported, so a wrapper
cannot make a top-level `Theme` believe it is nested without swizzling. What
`scope` changes is _who wins_: `'nested'` takes a non-owning claim, so the
provider's own attribute writes are immediately reconciled back to the owner's
values. The observable result is the same; the mechanism is honest about being
corrective rather than preventive.

For the host shell, a framework-free entry point so a non-React shell can claim
the root before any container loads:

```ts
// @tecton/react — exported
export function configureTectonRoot(options: {
  mode?: TectonColorMode;
  /** Defaults to Tecton's own theme name; pass only for a versioned name. */
  themeName?: string;
}): () => void;
```

**What it cannot fix.** Nothing about tokens, layers or scroll lock. A container
that wants a genuinely different browser chrome from its host cannot have one —
there is one `<html>`.

**Needs Astryx changes?** No. (An upstream `<Theme rootSync={false}>` prop would
make this preventive instead of corrective and is worth proposing upstream —
**would need a swizzle or an upstream PR**.)

---

## 3. Theme-name and token strategy

**Addresses F2 and F3** — the token bleed. Measured trade-off in §12.3.

**Decision: one stable theme name (`tecton`) across all versions.**

Per-major names (`tecton-1`, `tecton-2`) do fix the in-wrapper bleed — A's button
returns to its own accent — but `<html data-astryx-theme>` holds one value, so
every out-of-wrapper surface is themed for exactly one version and wrong for the
rest (measured: a node outside every wrapper resolved `--color-accent` to A's
theme while B was on the page). Each copy's `registerTheme` map also stops
resolving the root name, so no-context `useTheme()` consumers fall to upstream
defaults. That trade is worse than the bleed for a design system whose versions
are meant to look alike.

Three rules make the shared name safe enough:

1. **Complete token coverage.** Every Tecton version must override the _same
   complete set_ of tokens, so no token is ever answered by an upstream default
   and no version's coverage is wider than another's. Today's placeholder theme
   overrides one token; the real theme must be exhaustive. Enforce it in
   `packages/react/scripts/build.mjs`: compare the token names in the generated
   `theme.css` against a checked-in `theme-token-manifest.json` and fail the
   build on any omission. This is what turns F3 from a live hazard into a build
   error, and it is the prerequisite for ever using per-major names.

2. **Token values are a cross-container contract.** Changing a token value
   changes every other version on the page. Treat it like a wire-format change:
   it lands in a coordinated release, not on one container's train. Record it in
   the changelog under a heading the release process reads.

3. **A per-major name is the escape hatch for a deliberate break**, shipped only
   together with host-owned-root mode (§2) and an explicit statement of which
   version owns out-of-wrapper surfaces.

Also: **ship no component override rules whose selectors depend on the upstream
major** where it can be avoided. The bare prop/state classes (`.primary`, `.sm`,
`.standard`) are still emitted by 0.6.2 through the 0.7.0 removal window, so both
spellings work today and neither will keep working across the removal. Tecton's
generated `theme.css` uses whatever the pinned CLI emits; the rule is simply that
`theme.css` is always regenerated against the pinned upstream (the build already
does this) and never hand-edited.

**What it cannot fix.** Two versions that genuinely want different values for the
same token under the same name cannot both be right. Nothing wrapper-side changes
that.

**Needs Astryx changes?** No.

---

## 4. Scroll-lock coordination

**Fixes F1** — the S1 defect: body left `position: fixed; top: -400px` with
nothing open, page permanently unscrollable.

A second `Symbol.for` record, and the first piece of Tecton-owned component
surface it needs:

```ts
// src/runtime/scrollLock.ts
const KEY = Symbol.for('tecton.scrollLock/v1');

export interface TectonScrollLockRegistry {
  readonly version: 1;
  /**
   * Called on the 0 -> 1 transition of Tecton-owned modals across every copy.
   * Snapshots the body's genuinely pristine style, before any copy pins it.
   */
  acquire(): () => void;
  inspect(): {
    holders: number;
    pristine: Record<string, string> | null;
    repairs: number;
  };
}
```

Wiring, in two layers:

1. **Ownership.** Tecton's own `Dialog` wrapper (Phase 3 will have one) calls
   `acquire()` when it opens and the returned release when it closes. The
   registry snapshots `position`/`top`/`left`/`right`/`overflow` and
   `window.scrollX/Y` on the **0 → 1** transition _across all copies_, and
   restores exactly that on the **1 → 0** transition. Because the wrapper's
   effect is a parent of the upstream `Dialog`'s, its cleanup runs after the
   upstream restore, so the last word belongs to the registry.

2. **Watchdog.** While `holders === 0`, a `MutationObserver` on
   `body[style]` reverts any `position: fixed` / `overflow: hidden` that matches
   the pinning signature back to the recorded pristine values and bumps
   `repairs`. This is the safety net for effect-ordering surprises and for a
   container that pins the body some other way. It is deliberately narrow: it
   only acts when Tecton believes nothing is open, and only on the exact
   properties the lock touches.

Dev builds log once when `repairs > 0`, naming this failure mode, because a
silent repair hides a real integration problem.

**What it cannot fix.** Only modals opened through **Tecton's** wrapper are
counted. A container that reaches past Tecton to the upstream `Dialog` (or
`BottomSheet`, or `Lightbox`, which also call `useScrollLock`) still corrupts the
snapshot; the watchdog then repairs the _end state_ but cannot stop the
mid-sequence symptom where the page scrolls behind a still-open foreign modal.
Consequence for the package surface: **Tecton must own and export its own
`Dialog`/`BottomSheet`/`Lightbox` wrappers, and the consumer-surface check should
treat direct upstream imports in consuming code as unsupported.**

**Needs Astryx changes?** The real fix does: `useScrollLock` should key its
counter and snapshot on `document` the way `interactionModality` already does.
That is a small, obviously-correct upstream change and the right thing to
propose — **it requires a swizzle or an upstream PR, i.e. user approval.** The
registry above is what ships until then.

---

## 5. Layer policy

**Addresses F6, F7, F10.** This is the area where a wrapper genuinely cannot fix
the mechanism, so the proposal is mostly policy plus one targeted registry.

**What cannot be fixed wrapper-side.** `layerStack`'s entry array and its single
`document` listener are module-private with no registration API, so two copies
cannot share an ordering. One Escape does close exactly one layer (the
`defaultPrevented` guard makes the second copy stand down — measured), but the
layer it closes is chosen by which copy attached its listener first, not by what
is on top. Fixing that properly means keying the stack on `document` upstream —
same shape as §4's upstream ask, **needs Astryx changes**.

**What ships instead:**

1. **A document-keyed modal registry** — `Symbol.for('tecton.modal/v1')` —
   holding at most one open Tecton modal per page. Tecton's `Dialog` wrapper
   consults it: opening a second modal while another container holds one logs a
   dev warning and (configurably) defers. This removes the two worst cases at
   once — the overlapping scroll locks of F1 and the cross-container Escape
   inversion of F6 — by removing the state in which they happen. It also makes
   F10 (a modal freezing every other container) an explicit, single, visible
   event rather than an emergent one.

2. **Cross-container layer nesting is unsupported, in writing.** Rendering one
   container's layer into another container's DOM subtree produced: one Escape
   closing the _outer_ dialog, the inner layer surviving orphaned in the DOM, and
   a second React root left rendering into a detached node. Tecton exposes no API
   that makes this easy, and the docs say plainly that a container's layers
   belong to that container's tree.

3. **Documented Escape semantics for integrators**: with N containers, one
   Escape dismisses one layer, and when layers from different containers are open
   simultaneously the choice is not the visual stack. Host shells that care
   should not let two containers hold layers open at once.

**Needs Astryx changes?** For the ordering, yes. For the policy, no.

---

## 6. Toast policy

**Addresses F8, F12.** Two viewports landed at identical coordinates with toasts
drawn exactly on top of each other.

Preferred design — a **document-keyed toast bus**:

```ts
const KEY = Symbol.for('tecton.toast/v1');

/** Structured, cross-copy-safe payload. Deliberately not ReactNode. */
export interface TectonToastPayload {
  title?: string;
  body: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
  action?: {label: string; onAction: () => void};
}

export function useTectonToast(): (t: TectonToastPayload) => () => void;
```

- The first `TectonProvider` with `scope="root"` publishes its viewport's
  `addToast`/`removeToast` into the registry.
- `useTectonToast` in **any** copy sends through the registry, so every toast
  lands in one viewport, in one stack, with one set of dismiss timers.
- `scope="nested"` providers render no viewport at all.
- If no publisher exists yet, queue and flush on publish (upstream's own fallback
  proxy does the same thing within one copy).

The payload is **data, not `ReactNode`**, because an element created by copy A's
React cannot be rendered by copy B's. That is a real constraint on Tecton's toast
API and should be decided now rather than discovered later: Tecton toasts take
strings and a small action descriptor, and rich content is out of scope.

Fallback if the bus is too much for Phase 3: keep one viewport per container, add
`toast: {position}` to `TectonProviderProps`, and warn in dev when two Tecton
viewports are mounted at the same position. That is strictly worse — it moves the
overlap rather than removing it — and should be labelled interim.

**What it cannot fix.** Toasts raised by a container calling upstream `useToast`
directly still get their own viewport. Same surface conclusion as §4: Tecton owns
the toast API.

**Needs Astryx changes?** No.

---

## 7. Stylesheet packaging and load-order guidance

**Addresses F9 and F13.** Validated: deleting both sheets' `@layer reset` blocks
restored the host's `<h1>` to its UA default while the container's panel stayed
fully themed.

1. **Add `@tecton/react/styles-no-reset.css`** — the same bundle minus the
   upstream reset, for host shells that own their own reset or cannot accept one
   arriving from a container. Same `@layer reset, astryx-base, astryx-theme;`
   statement line, so a page mixing the two entry points still gets one correct
   layer order.
2. **Keep the explicit layer statement first in both entry points.** Measured
   stable in both load orders; it is the thing that makes load order _not_ matter
   for layering. Keep the build's assertion that it is present.
3. **Document load order as load-bearing for tokens.** Under one theme name, the
   last-loaded `theme.css` wins for every container. The host shell should load
   Tecton stylesheets deterministically — ideally exactly one, the newest — rather
   than letting whichever bundle loads first inject one.
4. **State the duplication cost**: ~189 kB and ~50% byte-identical rules per
   extra concurrent version. A release policy bounding how many versions may be
   live at once is a cheaper mitigation than any technical one.
5. **Document the prose-scope effect**: a container themes its host's headings
   and body text, because the theme's prose layer is scoped to
   `[data-astryx-theme]` and the root `Theme` puts that on `<html>`. It cannot be
   narrowed without giving up the root attribute that §1 depends on. Hosts that
   cannot accept it should render their own content inside an element carrying a
   different `data-astryx-theme` value, which closes the scope.

**Needs Astryx changes?** No.

---

## 8. Announcements

**Addresses F11**, low priority. Route Tecton's own `announce` through a
`Symbol.for('tecton.announce/v1')` singleton so Tecton-originated messages use
one pair of live regions. Upstream components still announce through their own
copy's regions; this only stops Tecton from adding to the duplication.

**Needs Astryx changes?** No (for the upstream half, yes — out of scope).

---

## 9. What to build, in order

|     | Item                                                              | Fixes                              | Size                              | Upstream change needed                 |
| --- | ----------------------------------------------------------------- | ---------------------------------- | --------------------------------- | -------------------------------------- |
| 1   | `rootRegistry` + `TectonProvider scope` + `configureTectonRoot`   | F4, F5                             | small, prototyped                 | no                                     |
| 2   | Scroll-lock registry + watchdog, behind a Tecton `Dialog` wrapper | F1 (**S1**)                        | medium — needs the Dialog wrapper | proper fix does; ship the registry now |
| 3   | Complete-token-coverage manifest + build assertion                | F2, F3, and F14's `:root` defaults | small                             | no                                     |
| 4   | `styles-no-reset.css` + load-order and prose-scope docs           | F9, F13                            | small, validated                  | no                                     |
| 5   | Modal registry + "no cross-container nesting" policy              | F6, F7, F10                        | small                             | ordering fix does                      |
| 6   | Toast bus + `useTectonToast`                                      | F8, F12                            | medium — decides the toast API    | no                                     |
| 7   | Announce singleton                                                | F11                                | small                             | no                                     |

Items 1, 3 and 4 are independent of the component set and can land immediately.
Items 2, 5 and 6 depend on Tecton owning `Dialog` and the toast API, which is the
real architectural consequence of this analysis: **a wrapper can only coordinate
the document-level state it is in the call path for.** Anything a consumer reaches
past Tecton to import stays uncoordinated.

---

## 10. The two upstream asks

Both are small and both would replace a corrective mitigation with a preventive
one. Neither can be done from a wrapper; both mean swizzling or an upstream PR,
and therefore need user approval before anyone starts.

1. **`useScrollLock` keys its counter and snapshot on `document`**, the way
   `interactionModality` already keys its store. Removes F1 outright, for every
   Astryx consumer, not just Tecton's.
2. **`layerStack` keys its entry list and listener on `document`.** Removes F6
   and F7: one stack, one ordering, one listener, regardless of how many copies
   are loaded. The existing `depth`/containment/`seq` comparator already does the
   right thing once it can see every entry.

A third, smaller one worth raising: **`<Theme rootSync={false}>`**, or ref-counted
root attributes upstream, which would make §1 unnecessary.
