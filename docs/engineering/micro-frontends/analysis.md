# Several versions of `@tecton/react` on one page

An experimental study of what breaks when two independently built, independently
released containers each bundle their own copy of `@tecton/react` (and therefore
their own copy of `@astryxdesign/core` 0.6.2 and their own React 19) into one
document.

Everything below was measured, not reasoned about, except where a section says
otherwise. The harness that produced these numbers is kept in the scratch folder of the investigation and lands in the repository as `fixtures/consumers/mfe-harness/` in Phase 3; raw numbers are in
`evidence/results.json` and `evidence/run.log`, screenshots in `evidence/`.

---

## 1. Setup

### The two versions

`harness/build-versions.mjs` builds the package twice out of one source tree and
restores the tree afterwards, so the worktree is byte-identical before and after.

|                                     | version A                           | version B                              |
| ----------------------------------- | ----------------------------------- | -------------------------------------- |
| package version                     | `0.1.0`                             | `0.2.0`                                |
| theme name                          | `tecton`                            | `tecton` (deliberately the same)       |
| `--color-accent`                    | `light-dark(#1f9fa0, #32c9c9)` teal | `light-dark(#b8336a, #ff5fa2)` magenta |
| `--color-background-body`           | not overridden                      | `light-dark(#fdf3f8, #2a0d1c)`         |
| `--color-background-surface`        | not overridden                      | `light-dark(#ffe9f2, #3d1329)`         |
| Panel padding (Tecton's own StyleX) | `--spacing-4` → 16px                | `--spacing-8` → 32px                   |
| built StyleX class for that padding | `.tecton1shk3sm`                    | `.tecton1bav0fz`                       |

B is what a plausible second release train ships: a couple of retuned tokens and
one component whose own declaration moved. One token (`--color-accent`) is
contested — both versions override it. Two are uncontested — only B overrides
them, so they show what happens when versions _diverge in coverage_ rather than
in value.

### The page

`harness/host/mfe-page.html` is a host shell that owns nothing of the design
system. It links both stylesheets (order controlled by `?css=ab|ba`), loads two
IIFE bundles, and mounts each into its own `<div>`. Each bundle carries its own
React 19, its own `@tecton/react` and its own `@astryxdesign/core` — nothing is
external, nothing is shared. Each exposes `mount(el, opts)` / `unmount()`.

Astryx components (`Dialog`, `Popover`, `Tooltip`, `useToast`) are used directly
inside each container, because Tecton has no wrappers for them yet.

Driven with Playwright + the preinstalled Chromium at `/opt/pw-browsers`.

---

## 2. Experiment 1 — CSS cascade, load order, layers, `@property`

**Expected** (from `mfe-findings.md`): duplicate atomic classes harmless; layer
order fixed by first appearance; `:root` defaults last-wins; Tecton `theme.css`
scoped to `[data-astryx-theme="tecton"]` means the **last-loaded** stylesheet
wins for **both** containers; duplicate `@property` harmless.

**Observed — confirmed, and the effect is total.**

Stylesheet order **A then B**:

| probe                                           | container A (0.1.0)            | container B (0.2.0)            |
| ----------------------------------------------- | ------------------------------ | ------------------------------ |
| primary button background (`--color-accent`)    | `rgb(255, 95, 162)`            | `rgb(255, 95, 162)`            |
| panel background (`--color-background-surface`) | `rgb(61, 19, 41)`              | `rgb(61, 19, 41)`              |
| `--color-accent` as authored                    | `light-dark(#b8336a, #ff5fa2)` | `light-dark(#b8336a, #ff5fa2)` |
| panel padding                                   | **16px**                       | **32px**                       |

Stylesheet order **B then A**:

| probe                        | container A (0.1.0)            | container B (0.2.0)            |
| ---------------------------- | ------------------------------ | ------------------------------ |
| primary button background    | `rgb(50, 201, 201)`            | `rgb(50, 201, 201)`            |
| panel background             | `rgb(61, 19, 41)`              | `rgb(61, 19, 41)`              |
| `--color-accent` as authored | `light-dark(#1f9fa0, #32c9c9)` | `light-dark(#1f9fa0, #32c9c9)` |
| panel padding                | **16px**                       | **32px**                       |

Screenshots: `harness/results/cascade-order-ab.png`,
`harness/results/cascade-order-ba.png` — in one, both containers' buttons are
magenta; in the other, both are teal. Nothing about the container decides it;
the `<link>` order does.

Three separate findings sit in that table:

1. **Contested tokens: last-loaded stylesheet wins, for every container.** Both
   sheets put `--color-accent` in `@layer astryx-theme` under the identical
   `@scope ([data-astryx-theme="tecton"]) to ([data-astryx-theme])` selector, so
   they have equal specificity, equal layer and equal scope proximity. Source
   order decides — and it decides for _both_ subtrees, because both wrappers
   carry the same theme name. Container A, a released artefact that nobody
   touched, renders in container B's brand colour.

2. **Uncontested tokens: the version that overrides at all always wins.**
   `--color-background-surface` is `rgb(61, 19, 41)` (B's value) in both load
   orders and in both containers, because A has no competing rule in
   `astryx-theme` and the upstream default lives one layer down in
   `astryx-base`. A wider token set beats a narrower one regardless of order.
   Corollary: a version that _removes_ a token override silently hands that
   token to whichever other version still has one.

3. **Component styles written in StyleX are version-safe.** Panel padding is
   16px in A and 32px in B in every configuration. The atomic class name is a
   hash of the declaration (`.tecton1shk3sm` vs `.tecton1bav0fz`), so the two
   versions' rules coexist and each element carries only its own. This is the
   one part of the styling surface that behaves correctly by construction.

**Cascade layers.** Both sheets open with `@layer reset, astryx-base,
astryx-theme;`. Measured statement rules, in both load orders:

```
[{"sheet":"tecton-a.css","statement":["reset","astryx-base","astryx-theme"]},
 {"sheet":"tecton-b.css","statement":["reset","astryx-base","astryx-theme"]}]
```

The first statement fixes the order; the second is a no-op because the names are
already registered. Order is `reset < astryx-base < astryx-theme` in both load
orders. **Confirmed, no action needed** — this is exactly what the explicit
statement line in `dist/tecton.css` is for.

**`@property`.** 48 registrations, each present **twice**, **zero conflicting
definitions** (`syntax`/`inherits`/`initial-value` identical across copies).
Harmless today. The probe is worth keeping: two different upstream _majors_ could
register the same `--x-*` name with a different initial value, and the
last-registered one would silently win for both copies' components.

**The reset and the theme prose reach host-owned markup.** The host shell's own
`<h1 id="host-title">`, which no container renders:

| stylesheets                                       | `font-size` | `font-weight` | `font-family` | `color`                |
| ------------------------------------------------- | ----------- | ------------- | ------------- | ---------------------- |
| none                                              | 32px        | 700           | system-ui     | white                  |
| Tecton loaded, `<html data-astryx-theme>` present | **24px**    | **600**       | **Figtree**   | **rgb(223, 226, 229)** |
| Tecton loaded, attribute removed                  | 16px        | 400           | system-ui     | white                  |
| `@layer reset` blocks deleted entirely            | 32px        | 700           | —             | —                      |

Two distinct mechanisms, both hitting markup the container does not own:

- The **global reset** (`:where(h1) { font-size: inherit }`) flattens host
  headings — that is the documented job of a global reset.
- The **theme's prose layer** is `@scope`d to `[data-astryx-theme="tecton"]`, and
  the root `Theme` puts that attribute on `<html>`. The scope root is therefore
  the whole document, and the only thing excluded is the subtree _inside another_
  `[data-astryx-theme]` element. Host-shell markup sits between `<html>` and the
  wrappers, so it is **inside** the scope. A container restyles its host's
  headings, body text and colour by mounting.

---

## 3. Experiment 2 — portals, overlays, and what an unmount does to them

**Expected**: layers portal out and depend on `<html data-astryx-theme>`; any
container's unmount strips the attributes and strands the others' portals.

**Observed — the premise is half wrong, and that changes the severity.**

**Layers stay inside their own wrapper.** Tooltip, popover and dialog all render
at their JSX position; `resolveLayerPortalTarget` returns `null` when no ancestor
is unsafe, so nothing goes to `document.body`. Measured DOM chains:

```
tooltip  div#_r_3_[popover=manual] < div < section < div[data-container=a] < div[theme=tecton] < div#slot-a
dialog   div < div < dialog < div[data-container=a] < div[theme=tecton] < div#slot-a
```

All three report `themeScope: "tecton"`, `themeScopeIsHtml: false`,
`inBody: false`. The toast viewport too (`themeScope: "tecton"`, rendered by
`LayerProvider` as a sibling of the container's children, still inside the Theme
wrapper). `strayThemedNodes()` returns `[]` — nothing escapes.

**So unmounting B does not break A's overlays.** After `__mfe.unmount("b")` with
A's tooltip, popover, dialog and toast open, every one of them keeps
`colorScheme: "dark"` and the same resolved colours. **This part of the
hypothesis is refuted.**

**But the `<html>` attributes really are removed, and they really do matter for
the cases where a layer cannot stay in the wrapper.**

```
both mounted        {"dataTheme":"dark","dataAstryxTheme":"tecton","colorScheme":"dark"}
after B unmounts    {"dataTheme":null,"dataAstryxTheme":null,"colorScheme":"light dark"}
```

`useRootThemeSync`'s cleanup calls `removeAttribute` unconditionally; there is no
ref count, and container A never re-asserts, so the attributes are gone for the
rest of the page's life. Consequences measured:

- **`<html>`'s used `color-scheme` reverts from `dark` to `light dark`** — the
  page canvas, scrollbars, native form controls and date pickers flip to the OS
  preference underneath a still-dark application.
- **Anything a layer _cannot_ keep inside the wrapper loses its theme
  completely.** With the host shell's slot wrapped in an `<a>` (an unsafe layer
  host, so `resolveLayerPortalTarget` hoists the layer out to `div#shell`):

  |                                       | `--color-accent`               | `color`            | `color-scheme` |
  | ------------------------------------- | ------------------------------ | ------------------ | -------------- |
  | while `<html>` carries the attributes | `light-dark(#b8336a, #ff5fa2)` | `rgb(255,255,255)` | `dark`         |
  | after the attributes are stripped     | `light-dark(#0064E0, #2694FE)` | `rgb(0,0,0)`       | `light dark`   |

  `#0064E0` is the **upstream default accent** — not Tecton's teal, not Tecton's
  magenta. The layer is entirely unthemed: upstream blue, black text, light
  scheme, floating over a dark application.

  The same applies to the toast **fallback** viewport, which `useToast` mounts on
  `document.body` and themes purely by mirroring `<html>`. Tecton does not hit
  that path today because `TectonProvider` always renders `LayerProvider` — worth
  keeping deliberately.

**Re-asserting the attributes restores everything**, which is the mitigation
signal: after setting the two attributes back by hand, `<html>` reads
`{"dataTheme":"dark","dataAstryxTheme":"tecton","colorScheme":"dark"}` again and
the hoisted layer returns to Tecton colours. Experiment 9a turns that into a
mechanism.

---

## 4. Experiment 3 — Escape and the per-copy layer dismissal stacks

**Expected**: one Escape dismisses the top layer of _every_ copy, so a dialog in
A and a menu in B both close.

**Observed — refuted, for a reason worth knowing; but a different, subtler bug is
confirmed.**

| scenario                                  | before              | after one Escape               |
| ----------------------------------------- | ------------------- | ------------------------------ |
| A's dialog opened first, then B's popover | dialog ✓, popover ✓ | **dialog ✗**, popover ✓        |
| dialog + popover both in A (control)      | dialog ✓, popover ✓ | dialog ✓, **popover ✗**        |
| two Escapes, cross-copy                   | dialog ✓, popover ✓ | 1st: dialog ✗ · 2nd: popover ✗ |

Event trace for every case:

```
[{"at":"document-capture","defaultPrevented":false},
 {"at":"window-bubble","defaultPrevented":true}]
```

**Exactly one layer closes per press.** The two copies each install a `keydown`
listener on `document`; the first to run resolves the press against its own stack
and calls `event.preventDefault()`; the second listener's first guard is
`if (event.defaultPrevented) return;`. The guard that exists so content inside a
layer can claim a press also makes the second module copy stand down. **The
"everything closes at once" hypothesis is refuted.**

**The wrong layer closes.** In the first row B's popover was opened _last_ and
renders _on top_, and Escape closed A's dialog underneath it. The press goes to
whichever copy's stack became non-empty first — that copy attached its document
listener first, and same-target listeners fire in registration order. The
`depth`/containment/`seq` ordering inside `layerStack` is correct but only ever
sees one copy's entries; there is no cross-copy comparison at all.

**Cross-version nesting orphans the inner layer.** B's popover rendered into a
`<div>` inside A's open dialog (`mountForeign`), one Escape:

```
before  {aDialog: true,  bNested: true}
after   {aDialog: false, bNested: true, nestedInDom: true}
2nd     {aDialog: false, bNested: false}
```

The **outer** dialog closed and the **inner** popover survived — the exact
inversion of what one Escape should do. A's copy owned the press; its stack
contains only A's dialog; B's nested popover is invisible to it. The nested
popover is still in the DOM after its host dialog closed. (It is also rendered by
a second React root into a node A's React owns, so A can detach the node while
B's root keeps rendering into it — a leak independent of Astryx. Cross-container
layer nesting should be documented as unsupported.)

**A modal in one container makes every other container unreachable.**

```
{"bTriggerReachable":false,"bTriggerHitTestsTo":"dialog","dialogIsModal":true}
```

Correct modal semantics, but in a micro-frontend it means any container can
freeze the whole page — including containers on other release trains, whose
owners never agreed to it. This is a policy question, not a bug.

---

## 5. Experiment 4 — scroll lock

**Expected**: A locks and snapshots the pristine body; B locks and snapshots A's
_pinned_ body as "original"; A unlocks first; B's later restore reinstates the
pinned state and the page is stuck.

**Observed — confirmed exactly, and it is the worst failure found.**

| step                                  | `body.style.position` | `top`        | `overflow`   | `scrollY` |
| ------------------------------------- | --------------------- | ------------ | ------------ | --------- |
| 0. scrolled to y=400                  | _(unset)_             | _(unset)_    | _(unset)_    | 400       |
| 1. A's modal open                     | `fixed`               | `-400px`     | `hidden`     | 0         |
| 2. B's modal also open                | `fixed`               | `0px`        | `hidden`     | 0         |
| 3. A's modal closed, **B still open** | _(unset)_             | _(unset)_    | _(unset)_    | 400       |
| 3b. tried to scroll behind B's modal  | _(unset)_             | _(unset)_    | _(unset)_    | **900**   |
| 4. B's modal closed, **nothing open** | **`fixed`**           | **`-400px`** | **`hidden`** | 0         |
| 5. tried to scroll, nothing open      | `fixed`               | `-400px`     | `hidden`     | **0**     |
| control: open+close entirely in A     | _(unset)_             | _(unset)_    | _(unset)_    | 400       |

Two defects in one sequence:

- **Step 3b — the lock is released while a modal is still open.** A's copy sees
  its own counter reach 0 and restores the body, so the page scrolls behind B's
  modal (400 → 900).
- **Steps 4–5 — the page is permanently frozen with no modal open.** B's copy
  restores the snapshot it took in step 2, which was A's _pinned_ state. `body`
  is left `position: fixed; top: -400px; overflow: hidden` and `scrollTo` does
  nothing. Only a reload recovers. Step 2's `top: 0px` also shows the secondary
  symptom: opening B's modal scrolls A's dialog content to the document origin,
  because `window.scrollY` already reads 0 on a pinned body.

The control row proves the mechanism is fine within one copy — this is purely a
consequence of `lockCount`/`originalBodyState` being module-level state that two
copies each own a private instance of.

---

## 6. Experiment 5 — toasts

**Expected**: one viewport per copy, overlapping at the same corner.

**Observed — confirmed, pixel for pixel.**

Two viewports, each `position: fixed` with `popover="manual"` (so both are in the
browser's top layer), each inside its own container's Theme wrapper:

```
A: rect {x:0, y:716, w:1280, h:84}  toasts:1  "toast from a"
B: rect {x:0, y:716, w:1280, h:84}  toasts:1  "toast from b"
overlap: {x:1280, y:84}  -> overlaps: true
```

The toast surfaces themselves land at **identical coordinates**
`{x:864, y:732, w:400, h:52}`. One is drawn on top of the other; whichever
viewport is later in the top layer wins, and the other toast is invisible while
still counting against its own `maxVisible` and still running its dismiss timer.
Screenshot: `harness/results/toasts-two-viewports.png`.

Two further per-copy singletons show up here:

- **Live regions are duplicated**: four regions, two polite and two assertive,
  and both polite regions were populated (`"toast from a"`, `"toast from b"`).
  Screen-reader users get the announcements of every container from a separate
  region each. Benign for one toast per container; a source of double
  announcements when containers announce the same event.
- **F6 focus handoff is ambiguous**: `ToastViewport` installs its own `document`
  `keydown` listener for F6. With two viewports holding toasts, one press reaches
  both and focus landed in **viewport index 1** (`"toast from b"`) — the last
  listener to run wins. The user asking for "the newest toast" gets whichever
  container mounted last.

---

## 7. Experiment 6 — colour mode

**Expected**: containers fight over `<html data-theme>`, last mounted wins;
wrappers keep their own `color-scheme`; portals follow `<html>`.

**Observed — confirmed for `<html>`, refuted for portals.**

With `modeA=dark`, `modeB=light`:

| mount order | `<html data-theme>` | `<html>` used `color-scheme` |
| ----------- | ------------------- | ---------------------------- |
| A then B    | `light`             | `light`                      |
| B then A    | `dark`              | `dark`                       |

Each wrapper keeps its own mode in both orders — A's wrapper is
`data-theme="dark"`, `color-scheme: dark`, panel `rgb(61,19,41)`; B's is
`light` / `light` / `rgb(255,233,242)`. In-wrapper content is correct for both
containers regardless of who won `<html>`.

**A's dialog keeps A's mode** (`themeScopeMode: "dark"`, `colorScheme: "dark"`,
`color: rgb(255,255,255)`) even when `<html>` says `light` — because it never
leaves A's wrapper. The "portals follow `<html>`" worry only applies to layers
hoisted out by an unsafe host (§3) and to the toast fallback viewport.

What `<html data-theme>` actually controls, then, is the **page canvas and the
browser chrome**: scrollbars, native controls, the colour behind everything. In
`harness/results/modes-mount-ab.png` a dark container sits on a light page
canvas because the light container mounted second. And any container's unmount
takes it away entirely:

```
before B unmounts  {"dataTheme":"light","dataAstryxTheme":"tecton","colorScheme":"light"}
after  B unmounts  {"dataTheme":null,"dataAstryxTheme":null,"colorScheme":"light dark"}
```

---

## 8. Experiment 7 — selector contract across an upstream major

Only 0.6.2 is installed, so two different upstream majors cannot actually be put
on one page. What _can_ be measured is the thing the 0.6.0 breaking change turns
on: whether a 0.5.x-built `theme.css` still matches what a 0.6.2 component
renders.

**Measured, and it contradicts a plain reading of the changelog.** A 0.6.2
`Button` renders:

```
stable:    ["astryx-button"]
bare:      ["primary", "md", "none"]
dataAttrs: ["data-variant=primary", "data-size=md", "data-elevation=none"]
```

A 0.6.2 `Dialog` renders `astryx-dialog` **plus** the bare class `standard`
alongside `data-variant=standard`. The 0.6.0 note ("Stop emitting deprecated bare
prop and state classes such as `.primary`, `.sm`, `.checked`") is superseded by
the 0.6.1 note, which keeps "released bare prop/state selector classes through
the **0.7.0** removal window". Match counts on the live page:

| selector                                                 | matches |
| -------------------------------------------------------- | ------- |
| `.astryx-button[data-variant="primary"]` (v0.6 spelling) | 2       |
| `.astryx-button.primary` (v0.5 spelling)                 | 2       |
| `.astryx-dialog[data-variant="standard"]`                | 2       |
| `.astryx-dialog.standard`                                | 2       |

Injecting one rule in each spelling into `@layer astryx-theme` under the theme's
`@scope`: **both apply** (`v05RuleApplied: true`, `v06RuleApplied: true`).

So, for A's old `theme.css` meeting B's 0.6.2 components **today**:

- **Token rules apply to both containers, unconditionally.** They are plain
  custom-property declarations under `[data-astryx-theme="tecton"]`; the
  component version is irrelevant. This is the §2 bleed, and it is the dominant
  effect.
- **Component override rules also apply to both containers**, because both
  spellings still match (the match count of 2 for each form is one element per
  container). A's theme restyles B's buttons and vice versa.
- **This stops being true at upstream 0.7.0.** Once the bare classes go, A's
  0.5-spelled rules match A's own 0.5 components (which still emit the classes)
  but _not_ B's 0.7 components — a partial, asymmetric theme where tokens cross
  the boundary and component overrides do not. Half-themed components are harder
  to spot than unthemed ones.
- Independently of the selector question, **two upstream majors mean two
  different `:root` token-default blocks in `@layer astryx-base`**, so any token
  whose upstream default changed resolves to the last-loaded copy's value for
  _both_ containers — the §2 mechanism one layer down. A theme that overrides the
  complete token set makes those defaults unreachable; Tecton's placeholder theme
  overrides one token, so today almost every token is exposed to it.
- And **`@property` initial values would be contested**: 48 names registered
  twice today with identical definitions; across majors a changed
  `initial-value` would silently win for both copies.
- The generic bare classes are also a host-collision hazard in their own right:
  `.primary` matches 4 elements on this page, and a host application with its own
  `.primary` rule would restyle Astryx components it has never heard of.

**Conclusion:** an old `theme.css` meeting new components is currently _more_
compatible than the changelog suggests, and will become _less_ compatible at
upstream 0.7.0. Tecton should not rely on either state: the build already
recompiles `theme.css` against the pinned upstream on every release, and the rule
that matters is that **built theme CSS is never repaired at runtime** — a
container must ship the `theme.css` that was built against the upstream version
it bundles, and versions on one page must be assumed to disagree.

---

## 9. Experiment 8 — everything else

| surface                     | measured                                                                                                                   | verdict                                                                                                                                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@font-face` rules          | `[]`, `document.fonts.size: 0`                                                                                             | Tecton ships no fonts; both versions name `Figtree, Helvetica, Arial, sans-serif` identically, so nothing contends. Loading is the host's job.                                                                                                                                               |
| runtime `<style>` injection | `data-astryx-theme`: 0, `-prose`: 0, `-base`: 0                                                                            | Both themes are `__built: true`, so no copy injects anything. The injection path's own ref-counting (`dataTokenDefaultsRefCount`) is per-copy and would be contended — built themes avoid it entirely. Keep the build's `__built` assertion.                                                 |
| `interactionModality`       | `Symbol.for('@astryxdesign/core/interaction-modality/v1')` present on `document`, `writable: false`, `configurable: false` | Genuinely shared across copies, as designed. The upstream precedent for the mitigation in §11.1 — and a caution: the property is non-configurable, so whichever copy creates such a singleton owns it forever.                                                                               |
| live regions                | 4 (2 per copy)                                                                                                             | Duplicated; double announcements possible.                                                                                                                                                                                                                                                   |
| stylesheets                 | 2 links, 3982 style rules, **1987 exact duplicates**                                                                       | ~50% of the second version's CSS is byte-identical to the first. 189 kB → 379 kB for ~190 kB of distinct rules. Cost, not correctness.                                                                                                                                                       |
| theme registry              | `registerTheme` is a module-level `Map` per copy                                                                           | Each copy registers its own `tecton`. A no-context `useTheme()` consumer in copy A reads `<html data-astryx-theme>` and looks the name up in **A's** map, so it gets A's theme object even if B set the attribute. Benign while the name is shared; broken if the name is versioned (§11.3). |
| icon registry               | per copy, carried on the theme object                                                                                      | No contention; each copy resolves icons through its own theme.                                                                                                                                                                                                                               |

---

## 10. Failure-mode matrix

Severity: **S1** page unusable / data loss · **S2** visibly wrong UI, silent ·
**S3** wrong but recoverable / noticeable · **S4** cosmetic or cost only.

| #   | Scenario                                                  | Symptom                                                                                                                                                                                                               | Sev            | Root cause                                                                                                                                            | Mitigation                                                                                                                                         | Residual risk                                                                                                                                                                                      |
| --- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Modal in A and modal in B overlap in time                 | Body left `position:fixed; top:-400px` with nothing open; page permanently unscrollable. Also: page scrolls behind a still-open modal                                                                                 | **S1**         | `useScrollLock`'s `lockCount` / `originalBodyState` are module-level; copy B snapshots copy A's _pinned_ body as "pristine"                           | M4 document-keyed scroll-lock coordinator in Tecton's Dialog wrapper + body style-attribute watchdog                                               | Only covers modals opened through Tecton's wrapper; a container using Astryx `Dialog` directly still corrupts the snapshot. Proper fix is a document-keyed lock upstream (**needs Astryx change**) |
| F2  | Two versions with different token values on one page      | Every container renders the **last-loaded** stylesheet's tokens; A's released UI changes colour because B deployed                                                                                                    | **S2**         | Both `theme.css` files target the identical `@scope ([data-astryx-theme="tecton"])` in `@layer astryx-theme`; equal specificity, source order decides | M3 one stable theme name + complete token coverage + token values treated as a cross-container contract; per-major name only for a breaking change | Per-major names trade the bleed for unthemed out-of-wrapper layers (measured, §11.3). No wrapper-side fix makes two different values coexist under one name                                        |
| F3  | Version B ships a token override A does not have          | B's value applies to A regardless of load order                                                                                                                                                                       | **S2**         | Uncontested override in `astryx-theme` beats the upstream default in `astryx-base`                                                                    | M3: every Tecton version overrides the same complete token set, so coverage never differs                                                          | A version that _drops_ an override still hands the token away                                                                                                                                      |
| F4  | Any container unmounts                                    | `<html data-theme>` and `<html data-astryx-theme>` removed for the whole page; canvas/scrollbars flip to OS; layers hoisted out of a wrapper fall back to **upstream** defaults (`#0064E0`, light scheme, black text) | **S2**         | `useRootThemeSync` cleanup removes both attributes unconditionally, no ref count                                                                      | M1 `Symbol.for`-keyed ref-counted root registry with MutationObserver re-assertion (**proven**, §11.1)                                             | One microtask of wrong attribute state before the observer reverts (before paint, so not visible). A non-Tecton Astryx consumer on the page is not covered                                         |
| F5  | Two containers with different `mode`                      | `<html data-theme>` = last-mounted container's mode; page canvas and browser chrome disagree with at least one container                                                                                              | **S3**         | Same unconditional root sync; no arbitration                                                                                                          | M1 + M2 `scope="nested"` / `configureTectonRoot()` so the host shell owns the mode                                                                 | Containers still render their own mode inside their wrapper; a container that genuinely needs a different chrome cannot have it                                                                    |
| F6  | Dialog open in A, popover open in B, one Escape           | The **wrong** layer closes — the one underneath, in whichever copy registered its listener first                                                                                                                      | **S3**         | One `layerStack` + one `document` listener per copy; no cross-copy ordering. (`preventDefault` does stop _both_ closing)                              | M5 "one modal at a time" document registry + documented rule; forbid cross-container nesting                                                       | Non-modal layers still resolve by listener-registration order. A shared stack **needs Astryx changes**                                                                                             |
| F7  | B's layer rendered inside A's open dialog                 | One Escape closes the **outer** dialog and leaves the inner layer open and orphaned in the DOM                                                                                                                        | **S2**         | Inner layer is invisible to the copy that owns the press; also a second React root rendering into another root's node                                 | M5: document cross-container layer nesting as unsupported; Tecton exposes no API that makes it easy                                                | Nothing prevents a determined host from doing it                                                                                                                                                   |
| F8  | Toasts from two containers                                | Two viewports at identical coordinates; toasts drawn exactly on top of each other; one is invisible but still timing out                                                                                              | **S3**         | `LayerProvider`/`ToastViewport` is per copy; both are `position:fixed` + `popover="manual"` at the same corner                                        | M6 document-keyed toast bus (data-only payloads) or, minimally, a required distinct `position` per container + dev warning                         | A data-only bus cannot carry arbitrary `ReactNode` toast content across copies                                                                                                                     |
| F9  | Any Tecton stylesheet on a host page                      | Host-owned headings/body text restyled: `<h1>` 32px/700 → 24px/600/Figtree/themed colour                                                                                                                              | **S3**         | Global `@layer reset` _and_ the theme's prose layer, whose `@scope` root is `<html>` because the root `Theme` puts `data-astryx-theme` there          | M7 ship `@tecton/react/styles-no-reset.css`; document that a container themes its host's prose                                                     | The prose scope cannot be narrowed without giving up the root attribute, which F4's fix depends on                                                                                                 |
| F10 | Modal opened in any container                             | Every other container on the page becomes unreachable (hit-tests to the dialog)                                                                                                                                       | **S3**         | Correct `<dialog>` modal semantics; nothing to do with versions                                                                                       | M5 modal registry so at most one exists, plus an explicit policy                                                                                   | Inherent to modals; a host that cannot tolerate it must not let containers open them                                                                                                               |
| F11 | Two containers announce                                   | Four live regions; duplicate announcements                                                                                                                                                                            | **S4**         | `useAnnounce` regions are module-level per copy                                                                                                       | M8 route Tecton announcements through a document-keyed singleton                                                                                   | Astryx components announce through their own copy regardless                                                                                                                                       |
| F12 | One F6 press with two toast viewports                     | Focus lands in the last-registered viewport, not the newest toast                                                                                                                                                     | **S4**         | Per-copy `document` F6 listener in `ToastViewport`                                                                                                    | Falls out of M6 (one viewport)                                                                                                                     | Not fixable while two viewports exist                                                                                                                                                              |
| F13 | N versions on one page                                    | +189 kB CSS per extra version, ~50% byte-identical duplicates; +React and +upstream JS per bundle                                                                                                                     | **S4**         | No sharing by construction                                                                                                                            | M7 load-order/bundle guidance; keep the number of concurrent versions bounded by policy                                                            | Inherent to the architecture                                                                                                                                                                       |
| F14 | Two different **upstream majors** (not reproducible here) | Contested `:root` defaults in `astryx-base` resolve last-loaded-wins; contested `@property` initial values likewise; component override rules become asymmetric once 0.7.0 drops bare classes                         | **S2**, latent | Same cascade mechanics one layer down; selector contract changes across majors                                                                        | M3 complete token coverage makes the defaults unreachable; upstream-version skew bounded by release policy; keep the `@property` conflict probe    | A silent StyleX atomic-class hash collision across majors would be undetectable from the wrapper                                                                                                   |

---

## 11. Which hypotheses survived

From `mfe-findings.md` and `astryx-facts.md`:

**Confirmed**

- Theme CSS from two versions under one theme name → last-loaded wins for both
  containers (§2). Measured both directions.
- `:root` token defaults in `astryx-base` are last-wins; a theme that overrides
  the full token set makes them irrelevant (§2, §8).
- `@layer reset, astryx-base, astryx-theme;` first-appearance ordering holds in
  both load orders (§2).
- Duplicate `@property` registrations are harmless while the definitions match
  (§2); 48 × 2, zero conflicts.
- The global reset restyles host-page elements (§2).
- Root `Theme` sets **and unconditionally removes** `<html data-theme>` /
  `data-astryx-theme`; any unmount strips them for everyone (§3).
- Containers with different `mode` fight over `<html data-theme>`; last mounted
  wins; each wrapper keeps its own `color-scheme` (§7).
- `useScrollLock` counters are per copy and leave the body pinned (§5) — the
  predicted sequence, verbatim.
- One toast viewport per copy, overlapping at the same corner (§6).
- `useAnnounce` live regions duplicated (§6, §8).
- `interactionModality` is a genuinely shared `Symbol.for` singleton on
  `document` — the precedent for cross-copy sharing (§8).
- Icon and theme registries are per copy and benign **while the theme name is
  shared** (§8).
- Fonts: both versions name the same families; loading is the host's job (§8).

**Refuted**

- ~~"One Escape dismisses the top layer of _every_ copy simultaneously."~~ It
  dismisses exactly one, because the first copy to handle the press calls
  `preventDefault()` and the second copy's `defaultPrevented` guard stands it
  down. The real defect is that the press goes to the copy whose stack became
  non-empty first, so the **wrong** layer closes, and a cross-version nested
  layer is skipped entirely while its host closes (§4).
- ~~"Portals land outside the wrapper and depend on `<html data-astryx-theme>`."~~
  `resolveLayerPortalTarget` keeps tooltips, popovers, dialogs _and_ the
  `LayerProvider` toast viewport inside the container's Theme wrapper. They
  survive another container's unmount untouched. The root attribute only matters
  for layers hoisted out by an unsafe host ancestor and for the toast **fallback**
  viewport, which `TectonProvider` already avoids by always rendering
  `LayerProvider` (§3).
- ~~"`<html data-astryx-theme>` contention is the reason a per-major theme name is
  unusable."~~ The reason is narrower and measurable: with per-major names, the
  in-wrapper bleed is genuinely fixed (A's button returns to its own teal), but
  `<html>` can hold only one name, so out-of-wrapper layers get exactly one
  version's theme and the other version's are unthemed; and each copy's theme
  registry no longer resolves the root name (§12.3).

**Corrected / new**

- The theme's **prose** layer, not just the reset, reaches host-owned markup —
  because the `@scope` root is `<html>` once the root attribute is set (§2).
- Upstream 0.6.2 still emits the deprecated bare prop/state classes (`primary`,
  `md`, `standard`) through the 0.7.0 removal window, so a 0.5-built `theme.css`
  still matches 0.6.2 components today (§8).
- A modal in one container makes every other container unreachable (§4).
- One F6 press reaches every toast viewport (§6).
- Roughly half of a second version's CSS is byte-identical duplication (§9).

---

## 12. Mitigations, measured

The full design is in `mitigation-proposal.md`. Three of them were prototyped
against the real page, because a mitigation nobody ran is a guess.

### 12.1 Ref-counted root ownership with re-assertion — **works**

A `Symbol.for('tecton.rootOwnership/v1')` registry on `document`: `acquire()`
returns a release function, the first holder's descriptor decides the desired
attributes, and a `MutationObserver` on `<html>` reverts any write that disagrees
while a holder exists.

With the host slot in an unsafe ancestor (so A's popover is hoisted out of the
wrapper and therefore depends on `<html>`):

```
<html> with both mounted   {"dataTheme":"dark","dataAstryxTheme":"tecton","colorScheme":"dark"}
hoisted layer accent       light-dark(#b8336a, #ff5fa2)
<html> after B unmounts    {"dataTheme":"dark","dataAstryxTheme":"tecton","colorScheme":"dark"}
hoisted layer accent       light-dark(#b8336a, #ff5fa2)
registry stats             {"holders":1,"reasserts":1,...}
<html> after both unmount  {"dataTheme":null,"dataAstryxTheme":null,"colorScheme":"light dark"}
```

One re-assertion, the attributes survive, the hoisted layer keeps Tecton's accent
instead of dropping to upstream blue, and the attributes are still cleaned up
properly when the last holder leaves. Compare §3, where the same unmount left
`{"dataTheme":null,"dataAstryxTheme":null}` permanently.

Needs no Astryx change. The observer callback runs at the microtask checkpoint,
before paint, so there is no visible flash.

### 12.2 Shipping styles without the global reset — **works**

Deleting both sheets' `@layer reset` blocks restores the host's `<h1>` to
32px/700 while the container's panel stays fully themed
(`background: rgb(61,19,41)`, `padding: 16px`). A `styles-no-reset.css` entry
point is therefore viable: the reset is not load-bearing for Tecton's own
components. It does not remove the _prose_ contamination, which lives in the same
layer but comes from the theme and is scoped to the root attribute.

### 12.3 Per-major theme names — **works, with a measured cost**

Re-scoping B's stylesheet to `[data-astryx-theme="tecton-2"]` and relabelling B's
wrapper:

|                      | A's button            | B's button        | A's panel           | B's panel       |
| -------------------- | --------------------- | ----------------- | ------------------- | --------------- |
| shared name `tecton` | `rgb(255,95,162)`     | `rgb(255,95,162)` | `rgb(61,19,41)`     | `rgb(61,19,41)` |
| per-major names      | **`rgb(50,201,201)`** | `rgb(255,95,162)` | **`rgb(31,31,34)`** | `rgb(61,19,41)` |

The bleed is genuinely fixed: A returns to its own teal accent. But A's panel
falls to `rgb(31,31,34)` — the **upstream** default surface — because A's theme
never overrode `--color-background-surface` and can no longer borrow B's. That is
correct behaviour, and it is exactly why complete token coverage is a
prerequisite for this strategy.

The cost is at the root. `<html data-astryx-theme>` can hold one value, and it
kept saying `tecton`; a node outside every wrapper resolved `--color-accent` to
`light-dark(#1f9fa0, #32c9c9)` — A's theme — while B was on the page. With
per-major names, every out-of-wrapper surface (hoisted layers, toast fallback
viewports) is themed for exactly one version and wrong for all the others. Each
copy's `registerTheme` map also stops resolving the root name, so no-context
`useTheme()` consumers fall back to upstream defaults.

**Recommendation: keep one stable theme name** and make token _values_ a
cross-container contract, reserving a per-major name for a deliberate breaking
change shipped together with host-owned-root mode.
