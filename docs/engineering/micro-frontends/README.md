# Tecton in a micro-frontend

**Draft.** This is the consumer-facing guide for putting `@tecton/react` on a
page that has more than one of it. It states what a host shell must do, what
Tecton now handles for you, and what is not supported at all.

Everything here is anchored to measurement. [`analysis.md`](./analysis.md) is
the experiment that produced the failure modes and their numbers;
[`mitigation-proposal.md`](./mitigation-proposal.md) is the design;
[`fixtures/consumers/mfe-harness/`](../../../fixtures/consumers/mfe-harness/)
is the harness, and `pnpm check:mfe` re-runs it.

---

## 1. The recommended page shape: the host owns the tokens

One theme layer on the page, one owner of the document root, one stylesheet per
container for its own components.

```html
<!-- The shell loads exactly ONE tokens.css: the newest Tecton it knows about. -->
<link rel="stylesheet" href="/assets/tecton-0.4.0/tokens.css" />

<!-- Each container ships the component CSS that matches its own code. -->
<link rel="stylesheet" href="/containers/orders/tecton-components.css" />
<link rel="stylesheet" href="/containers/billing/tecton-components.css" />
```

```ts
// The shell, before any container loads.
import {configureTectonRoot} from '@tecton/react';

configureTectonRoot({mode: 'dark'});
```

```tsx
// Every container.
<TectonProvider mode="dark" scope="nested">
  <App />
</TectonProvider>
```

Why this shape:

- **Tokens stop being contested.** The token bleed (F2/F3) exists because two
  complete bundles each put their own token values in `@layer astryx-theme`
  under the same `@scope`, so source order decides — for _every_ container, not
  just the one that shipped last. With one `tokens.css` there is nothing to
  contest: every container renders in the host's token values, on purpose.
- **Component styles stay version-correct.** Tecton's own component CSS is
  StyleX, and an atomic class name is a hash of its declaration, so two
  versions' component rules coexist and each element carries only its own. A
  container's `components.css` matches the code in its bundle.
- **The root has an owner.** `configureTectonRoot()` claims `<html>` before any
  container mounts, so the page canvas, the scrollbars and the native controls
  follow the shell's decision and no container can change or remove them.

The entry points:

| Import                                  | Contains                                         | Who loads it                                 |
| --------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| `@tecton/react/styles.css`              | everything — reset, components, theme            | single-app pages                             |
| `@tecton/react/styles-no-reset.css`     | everything but the global reset                  | a host that owns its own reset               |
| `@tecton/react/tokens.css`              | the theme layer only                             | the host shell, **once**                     |
| `@tecton/react/components.css`          | reset + foundation + Tecton components, no theme | each container                               |
| `@tecton/react/components-no-reset.css` | the same without the reset                       | each container, when the host owns the reset |

Every one of them opens with `@layer reset, astryx-base, astryx-theme;`. That
line, not the order the sheets arrive in, is what fixes the cascade order:
the first statement a page sees registers the names and later ones are no-ops.
Mixing entry points and versions therefore still gives one correct layer order
(measured in both load orders).

### If you load complete bundles instead

Sometimes you cannot split — a container ships one file and that is that. Then:

1. **Load exactly one Tecton stylesheet if you possibly can**, and make it the
   newest. Two complete bundles mean the last-loaded one's tokens win for every
   container on the page.
2. **Load them in a deterministic order** you control from the shell — a fixed
   list of `<link>`s, not "whichever bundle initialises first".
3. **Know the cost**: about +190 kB of CSS per extra concurrent version, roughly
   half of it byte-identical to what is already there. Bound the number of
   concurrent versions by release policy; it is cheaper than any technical
   mitigation.

---

## 2. What the host shell must do

- **Load exactly one Tecton stylesheet per layer role.** One `tokens.css` for
  the page; one `components.css` per container.
- **Call `configureTectonRoot({mode})` before any container loads.** It returns
  a release function; a shell that lives as long as the page never calls it.
- **Make every container pass `scope="nested"`.** A nested provider still themes
  its own tree in its own `mode`, and still holds a non-owning claim so the
  attributes survive _its_ unmount, but it does not try to decide the page.
- **Decide the colour mode once.** There is one `<html>`; a container cannot
  have different browser chrome from its host.
- **Own your own reset, or accept Tecton's.** `styles.css` and `components.css`
  carry a global reset that restyles host-owned markup;
  `styles-no-reset.css` / `components-no-reset.css` do not.
- **Know that a container themes your prose.** The theme's prose styles are
  scoped to `[data-astryx-theme]`, and the root provider puts that attribute on
  `<html>`, so the scope root is the whole document. Host markup that sits
  between `<html>` and the containers is inside it. The way to close the scope
  is to render host content inside an element carrying a _different_
  `data-astryx-theme` value; the reset-free entry points drop the prose styles
  along with the reset layer.

## 3. What is unsupported

- **Cross-container layer nesting.** Rendering one container's dialog, popover
  or tooltip into another container's DOM subtree. Measured: one Escape closed
  the _outer_ dialog and left the inner layer open and orphaned in the DOM, and
  a second React root was left rendering into a node the first root can detach.
  A container's layers belong to that container's tree.
- **Mixed upstream majors.** Two Tecton versions built against different majors
  of the underlying library put two different `:root` default blocks in
  `@layer astryx-base` and two `@property` registrations per name, and their
  component selectors stop agreeing. Keep concurrent versions inside one
  upstream major; the release policy, not the code, is what enforces this.
- **Reaching past Tecton to the library underneath.** A container that imports
  the upstream `Dialog`, `BottomSheet` or `Lightbox` directly is outside every
  coordination mechanism here — Tecton can only coordinate document state it is
  in the call path for.
- **Two containers holding layers open at once.** With N containers, one Escape
  dismisses exactly one layer, and when layers from different containers are
  open simultaneously the one that closes is not the one on top.
- **A non-Tecton consumer of the same underlying library on the page.** It will
  keep fighting over the `<html>` attributes; nothing here reaches it.

---

## 4. Failure modes and where they stand

Severity from `analysis.md` §10. "Fixed" means the failure cannot happen in the
shape above; "mitigated" means the symptom is removed but something narrower
remains; "documented" means the behaviour is understood, deterministic and
written down, not changed; "approved, pending" means the real fix needs a change
to the library underneath Tecton, it has been approved as a swizzle/patch, and
it lands in a follow-up phase.

| #   | Failure                                                                    | Sev | Status                                                                | What ships                                                                                                     |
| --- | -------------------------------------------------------------------------- | --- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| F1  | Modals in two containers overlap; body left `position: fixed`, page frozen | S1  | **approved, pending**                                                 | Upstream scroll-lock fix (see §5). Until then: do not let two containers open modals at once                   |
| F2  | Two versions' token values contest each other; last-loaded wins for all    | S2  | **fixed** in the split shape; **documented** for two complete bundles | `tokens.css` / `components.css`, one theme layer on the page; load order rule otherwise                        |
| F3  | A version that overrides a token another does not wins it for both         | S2  | **fixed**                                                             | `theme-token-manifest.json` — the build fails if the built theme's token set drifts, so coverage cannot differ |
| F4  | Any container unmounting strips the `<html>` attributes for the whole page | S2  | **fixed**                                                             | `rootRegistry` — ref-counted claims, `MutationObserver` re-assertion, clean-up on the last release             |
| F5  | Two containers with different `mode` fight over the page chrome            | S3  | **fixed**                                                             | First owning claim wins; `configureTectonRoot()` + `scope="nested"` make the shell the owner                   |
| F6  | Escape closes the wrong layer across containers                            | S3  | **approved, pending**                                                 | Upstream layer-stack fix (see §5). Documented rule meanwhile: one container holds layers at a time             |
| F7  | A layer nested into another container's DOM is orphaned by one Escape      | S2  | **documented**                                                        | Unsupported, in writing; Tecton exposes no API that makes it easy                                              |
| F8  | Two toast viewports at identical coordinates; one toast invisible          | S3  | **not yet**                                                           | Toast bus (proposal §6), once Tecton owns the toast API                                                        |
| F9  | Any Tecton stylesheet restyles host-owned headings and prose               | S3  | **mitigated**                                                         | `styles-no-reset.css` / `components-no-reset.css`; the prose scope is documented and cannot be narrowed        |
| F10 | A modal in one container makes every other container unreachable           | S3  | **documented**                                                        | Correct modal semantics; a policy question for the shell, not a bug                                            |
| F11 | Duplicate live regions; double announcements                               | S4  | **not yet**                                                           | Announce singleton (proposal §8)                                                                               |
| F12 | One F6 press lands in the last-registered toast viewport                   | S4  | **not yet**                                                           | Falls out of the toast bus                                                                                     |
| F13 | +190 kB of mostly duplicate CSS per extra version                          | S4  | **mitigated**                                                         | The split entry points remove the duplicated theme layer; bound concurrent versions by policy                  |
| F14 | Two different upstream majors                                              | S2  | **documented**                                                        | Unsupported; complete token coverage makes the contested `:root` defaults unreachable                          |

The F8/F11/F12 rows wait on Tecton owning its own `Dialog` and toast API, which
is the real architectural consequence of the analysis: **a wrapper can only
coordinate the document-level state it is in the call path for.**

---

## 5. The two upstream changes

Both are approved as swizzles/patches and are scheduled for a follow-up phase.
Both replace a corrective mitigation with a preventive one, and neither can be
done from the wrapper.

1. **Key the scroll lock's counter and snapshot on `document`**, the way the
   interaction-modality store already is. This removes F1 outright — the S1
   defect where two containers' modals leave the body pinned with nothing open —
   for every consumer of the library, not just Tecton.
2. **Key the layer stack's entry list and its `document` listener on
   `document`.** One stack, one ordering, one listener however many copies are
   loaded. The existing depth/containment/sequence comparator already does the
   right thing once it can see every entry. This removes F6 and F7.

A third, smaller one is still worth raising and has **not** been decided: a
`rootSync={false}` prop (or ref-counted root attributes) on the upstream theme
provider, which would make the root registry unnecessary rather than corrective.

---

## 6. What Tecton does for you now

- `TectonProvider` takes `scope?: 'root' | 'nested'`. Default `'root'`;
  behaviour for a single provider on a page is unchanged.
- `configureTectonRoot({mode?, themeName?})` claims the document root from a
  host shell — a plain function, so a shell that is not a React application can
  call it — and returns a release function.
- Under the hood, a `Symbol.for('tecton.rootOwnership/v1')` record on `document`
  is shared by every copy of Tecton on the page. The first owning claim decides
  the attributes; a later owning claim that disagrees logs one development
  warning and is ignored; non-owning claims keep the attributes alive; the last
  release removes them. A `MutationObserver` puts back anything that disagrees.
  You never touch this directly — but `document[Symbol.for('tecton.rootOwnership/v1')].inspect()`
  tells you who holds the page when something looks wrong.
- The theme's token coverage is pinned by `theme-token-manifest.json` and
  checked on every build.
- The stylesheet is published as five entry points (§1).

Two things it deliberately does **not** do: it does not stop the underlying
provider writing the attributes in the first place (there is a one-microtask
window, before paint, in which a synchronous reader sees the wrong value), and
it does not reach a non-Tecton consumer of the same library.
