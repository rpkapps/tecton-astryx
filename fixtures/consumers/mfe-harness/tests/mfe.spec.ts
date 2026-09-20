/**
 * Two independently built versions of `@tecton/react` on one page.
 *
 * Most of these tests assert a mitigation that Tecton ships; two of them —
 * the scroll lock and the Escape ordering — assert the two upstream patches in
 * `patches/@astryxdesign__core@0.6.2.patch`, which every copy of Tecton
 * carries because the patched code is vendored into the package; and the last
 * two record what the cascade does, because the cascade is not something a
 * wrapper can fix — it is a property of the page, and the documented rule is
 * to make it deterministic rather than to pretend it is not there.
 *
 * The findings this file is anchored to are in
 * `docs/engineering/micro-frontends/analysis.md`; the model the split test
 * exercises is in `docs/engineering/micro-frontends/README.md`.
 */
import {test, expect, type Page} from '@playwright/test';

/** One container's bundle, as the host page exposes it. */
interface ContainerApi {
  openDialog(): void;
  closeDialog(): void;
  openMenu(): void;
  closeMenu(): void;
  raiseToast(body?: string): void;
}

declare global {
  interface Window {
    /** The host shell's driving API; see `host/mfe-page.html`. */
    __mfe: {
      mount(id: string, opts?: {mode?: string; scope?: string}): void;
      unmount(id: string): void;
      a: ContainerApi;
      b: ContainerApi;
    };
  }
}

/** What the shared root-ownership registry reports about the page. */
function registry(page: Page) {
  return page.evaluate(() => {
    const record = (
      document as unknown as Record<symbol, {inspect?: () => unknown}>
    )[Symbol.for('tecton.rootOwnership/v1')];
    return (record?.inspect?.() ?? null) as {
      holders: number;
      reassertions: number;
    } | null;
  });
}

async function open(page: Page, query: string): Promise<void> {
  await page.goto(`/mfe-page.html${query}`);
  await page.waitForFunction('window.__ready === true');
  // Long enough for any colour transition on a freshly mounted button.
  await page.waitForTimeout(250);
}

/** The two attributes every copy of Tecton writes to `<html>`. */
function root(page: Page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    return {
      mode: html.getAttribute('data-theme'),
      theme: html.getAttribute('data-astryx-theme'),
      colorScheme: getComputedStyle(html).colorScheme,
    };
  });
}

/** What one container's subtree actually resolves to. */
function container(page: Page, id: string) {
  return page.evaluate(containerId => {
    const panel = document.querySelector(
      `[data-testid="${containerId}-panel"]`,
    );
    const button = document.querySelector(
      `[data-testid="${containerId}-btn-primary"]`,
    );
    if (!panel) return null;
    const styles = getComputedStyle(panel);
    const wrapper = document
      .querySelector(`[data-container="${containerId}"]`)
      ?.closest('[data-astryx-theme]');
    return {
      panelBackground: styles.backgroundColor,
      panelPadding: styles.paddingTop,
      buttonBackground: button
        ? getComputedStyle(button).backgroundColor
        : null,
      accent: styles.getPropertyValue('--color-accent').trim(),
      surface: styles.getPropertyValue('--color-background-surface').trim(),
      wrapperMode: wrapper?.getAttribute('data-theme') ?? null,
      wrapperTheme: wrapper?.getAttribute('data-astryx-theme') ?? null,
      wrapperIsHtml: wrapper === document.documentElement,
    };
  }, id);
}

/** Host-owned markup that no container renders. */
function hostMarkup(page: Page) {
  return page.evaluate(() => {
    const h1 = getComputedStyle(document.getElementById('host-title')!);
    return {
      fontSize: h1.fontSize,
      fontWeight: h1.fontWeight,
      fontFamily: h1.fontFamily,
    };
  });
}

/** Cascade-layer statements, in document order across every sheet. */
function layerStatements(page: Page) {
  return page.evaluate(() => {
    const out: {sheet: string; statement: string[]}[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(rules)) {
        if (rule.constructor.name === 'CSSLayerStatementRule') {
          out.push({
            sheet: sheet.href?.split('/').pop() ?? 'inline',
            statement: [...(rule as CSSLayerStatementRule).nameList],
          });
        }
      }
    }
    return out;
  });
}

// ---------------------------------------------------------------------------
// The mitigations
// ---------------------------------------------------------------------------

test('the root attributes survive a sibling container unmounting', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab&modeA=dark&modeB=dark');
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
  // Both copies of Tecton reached the same record on `document`.
  expect(await registry(page)).toMatchObject({holders: 2, reassertions: 0});

  await page.evaluate(() => window.__mfe.unmount('b'));
  await page.waitForTimeout(200);

  // Before the ref-counted registry this was {null, null} for the rest of the
  // page's life, and the page canvas fell back to the OS colour scheme
  // (analysis.md F4).
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
  expect((await root(page)).colorScheme).toBe('dark');
  // ...and the count proves the mitigation is what did it: the unmounting
  // copy really did strip the attributes, and the registry put them back.
  expect(await registry(page)).toMatchObject({holders: 1, reassertions: 1});

  // Container A is untouched by its neighbour's departure.
  expect(await container(page, 'a')).toMatchObject({wrapperTheme: 'tecton'});

  // ...and the last one out still leaves the page clean.
  await page.evaluate(() => window.__mfe.unmount('a'));
  await page.waitForTimeout(200);
  expect(await root(page)).toMatchObject({mode: null, theme: null});
  expect(await registry(page)).toMatchObject({holders: 0});
});

test('the first owning claim decides the page mode, in either mount order', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab&modeA=dark&modeB=light');
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
  // Each container still renders in its own mode inside its own wrapper.
  expect(await container(page, 'a')).toMatchObject({wrapperMode: 'dark'});
  expect(await container(page, 'b')).toMatchObject({wrapperMode: 'light'});

  await open(page, '?styles=full&mount=ba&modeA=dark&modeB=light');
  // B mounts first now, so B's claim is the one that counts — first-wins, not
  // last-wins, which is what F5 measured before the registry.
  expect(await root(page)).toMatchObject({mode: 'light', theme: 'tecton'});

  // A host shell that claims the root first beats both of them.
  await open(
    page,
    '?styles=full&mount=ab&modeA=dark&modeB=light&hostRoot=1&hostMode=light',
  );
  expect(await root(page)).toMatchObject({mode: 'light', theme: 'tecton'});
});

test('styles-no-reset.css leaves host-owned markup alone', async ({page}) => {
  await open(page, '?styles=none&autoMount=0');
  const bare = await hostMarkup(page);

  await open(page, '?styles=full');
  const withReset = await hostMarkup(page);

  await open(page, '?styles=no-reset');
  const withoutReset = await hostMarkup(page);
  const panel = await container(page, 'a');

  // The complete bundle restyles the host's own <h1> — the global reset
  // flattens it and the theme's prose layer re-dresses it (analysis.md F9).
  expect(withReset.fontSize).not.toBe(bare.fontSize);

  // The reset-free entry point does not.
  expect(withoutReset).toEqual(bare);

  // ...while the container it serves is still completely themed. The padding
  // is B's, because both versions' sheets are linked and B is linked last —
  // see the cascade tests at the end of this file. (31px, not 32: the card's
  // own rule takes its 1px border out of the padding it was given.)
  expect(panel?.panelBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(panel?.panelPadding).toBe('31px');
  expect(panel?.wrapperTheme).toBe('tecton');

  test.info().annotations.push({
    type: 'measured',
    description: `host <h1> — no CSS: ${bare.fontSize}/${bare.fontWeight}; styles.css: ${withReset.fontSize}/${withReset.fontWeight}; styles-no-reset.css: ${withoutReset.fontSize}/${withoutReset.fontWeight}`,
  });
});

// ---------------------------------------------------------------------------
// The host-owns-the-tokens split
// ---------------------------------------------------------------------------

test("the split entry points give both containers the host's tokens", async ({
  page,
}) => {
  // The shell links exactly one tokens.css — version B's, the newest it knows
  // — and each container links its own components.css.
  await open(page, '?styles=split');

  const a = await container(page, 'a');
  const b = await container(page, 'b');

  // One theme layer on the page, so both containers resolve the same tokens:
  // the host's. Nothing is contested, in either load order.
  expect(a?.accent).toBe(b?.accent);
  expect(a?.accent).toContain('#ff5fa2');
  expect(a?.surface).toBe(b?.surface);
  expect(a?.panelBackground).toBe(b?.panelBackground);
  expect(a?.buttonBackground).toBe(b?.buttonBackground);

  // Per-component decisions travel with the tokens. Tecton is a theme, not a
  // second component library: every rule it ships is in `@layer astryx-theme`
  // under the theme's own `@scope`, so the host's single tokens.css decides
  // the card's padding for both containers exactly as it decides the accent.
  // That is the whole point of the split — one theme layer, nothing contested
  // — and it is why the token-coverage manifest covers the theme's component
  // custom properties as well as its tokens.
  expect(a?.panelPadding).toBe('31px');
  expect(b?.panelPadding).toBe(a?.panelPadding);

  // The layer order is still declared by every sheet, so it cannot depend on
  // which of them arrives first.
  for (const entry of await layerStatements(page)) {
    expect(entry.statement).toEqual(['reset', 'astryx-base', 'astryx-theme']);
  }

  // The shell owns the root, and a container leaving does not take it away.
  // Three holders: the shell's configureTectonRoot() and the two nested
  // providers, only the first of which is owning.
  expect(await registry(page)).toMatchObject({holders: 3});
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
  expect(a?.wrapperMode).toBe('dark');
  await page.evaluate(() => window.__mfe.unmount('a'));
  await page.waitForTimeout(200);
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
});

// ---------------------------------------------------------------------------
// The upstream patches: one scroll lock and one layer stack per page
// ---------------------------------------------------------------------------
//
// Both of these failed before `patches/@astryxdesign__core@0.6.2.patch`, and
// both fail again the moment a copy of Tecton on the page carries the
// unpatched library — which is why the package vendors the patched code rather
// than depending on it. See docs/engineering/upstream-patches.md.

/** What a scroll lock has done to the page. */
function bodyLock(page: Page) {
  return page.evaluate(() => ({
    position: document.body.style.position,
    top: document.body.style.top,
    overflow: document.body.style.overflow,
    scrollY: Math.round(window.scrollY),
  }));
}

/**
 * Which of the two containers' layers are on screen right now.
 *
 * Both are in the DOM for the container's whole life — a closed dialog is a
 * `<dialog>` that is not `open`, a closed menu is a hidden popover — so this
 * asks the DOM whether they are showing rather than whether they exist.
 */
function layers(page: Page) {
  return page.evaluate(() => {
    const isOpen = (id: string) =>
      (
        document.querySelector(
          `[data-testid="${id}-dialog"]`,
        ) as HTMLDialogElement | null
      )?.open ?? false;
    const visibleMenus = Array.from(
      document.querySelectorAll('[role="menu"]'),
    ).filter(menu => (menu as HTMLElement).checkVisibility());
    const menuText = visibleMenus.map(menu => menu.textContent ?? '').join(' ');
    return {
      dialogA: isOpen('a'),
      dialogB: isOpen('b'),
      menuA: menuText.includes('Rename A'),
      menuB: menuText.includes('Rename B'),
    };
  });
}

/** Drive one container's own React tree through its imperative handle. */
async function drive(
  page: Page,
  id: 'a' | 'b',
  action: 'openDialog' | 'closeDialog' | 'openMenu' | 'closeMenu',
): Promise<void> {
  await page.evaluate(
    ([containerId, method]) => {
      const api = window.__mfe[containerId as 'a' | 'b'] as unknown as Record<
        string,
        () => void
      >;
      api[method]!();
    },
    [id, action],
  );
  // Long enough for the layer to mount or unmount and its effects to settle.
  await page.waitForTimeout(150);
}

async function pressEscape(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}

test('two containers, one scroll lock: the body is restored only when the last modal closes', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(100);
  expect(await bodyLock(page)).toMatchObject({position: '', overflow: ''});

  await drive(page, 'a', 'openDialog');
  expect(await bodyLock(page)).toMatchObject({
    position: 'fixed',
    overflow: 'hidden',
    top: '-300px',
  });

  await drive(page, 'b', 'openDialog');
  expect(await bodyLock(page)).toMatchObject({position: 'fixed'});

  // Closing A while B is still open must leave the page pinned. Before the
  // patch each copy counted its own locks, so A's copy went 1 → 0 here and
  // restored the body — the page scrolled behind B's open modal, and B's own
  // close then restored the page to *A's pinned* snapshot: position: fixed,
  // top: -300px, nothing open, permanently unscrollable (analysis.md F1, S1).
  await drive(page, 'a', 'closeDialog');
  expect(await bodyLock(page)).toMatchObject({
    position: 'fixed',
    overflow: 'hidden',
    top: '-300px',
  });

  await drive(page, 'b', 'closeDialog');
  expect(await bodyLock(page)).toMatchObject({
    position: '',
    overflow: '',
    top: '',
    scrollY: 300,
  });

  // ...and the page really does scroll again.
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(100);
  expect((await bodyLock(page)).scrollY).toBe(600);
});

test('the scroll lock survives the containers closing in the other order', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab');
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(100);

  await drive(page, 'b', 'openDialog');
  await drive(page, 'a', 'openDialog');
  await drive(page, 'b', 'closeDialog');
  expect(await bodyLock(page)).toMatchObject({
    position: 'fixed',
    top: '-200px',
  });

  await drive(page, 'a', 'closeDialog');
  expect(await bodyLock(page)).toMatchObject({
    position: '',
    overflow: '',
    scrollY: 200,
  });
});

test('one Escape dismisses the layer on top, whichever container opened it', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab');

  // A dialog in A, then a menu opened over it from B.
  await drive(page, 'a', 'openDialog');
  await drive(page, 'b', 'openMenu');
  expect(await layers(page)).toMatchObject({dialogA: true, menuB: true});

  // Before the patch the two copies kept separate stacks and separate
  // document listeners, so the press went to whichever copy listened first —
  // A's dialog — and left B's menu open and orphaned (analysis.md F6/F7).
  await pressEscape(page);
  expect(await layers(page)).toMatchObject({dialogA: true, menuB: false});

  await pressEscape(page);
  expect(await layers(page)).toMatchObject({dialogA: false, menuB: false});
});

test('one Escape dismisses the layer on top with the containers the other way round', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab');

  // The same shape with the containers swapped: the dialog belongs to B and
  // the menu over it to A. Which container registered the layer is not a key
  // in the ordering — what is on top is — so the result must mirror exactly.
  await drive(page, 'b', 'openDialog');
  await drive(page, 'a', 'openMenu');
  expect(await layers(page)).toMatchObject({dialogB: true, menuA: true});

  await pressEscape(page);
  expect(await layers(page)).toMatchObject({dialogB: true, menuA: false});

  await pressEscape(page);
  expect(await layers(page)).toMatchObject({dialogB: false, menuA: false});
});

// ---------------------------------------------------------------------------
// Toasts: one viewport per copy, raised through the component system's own hook
// ---------------------------------------------------------------------------

/** Every toast on the page, and how many viewports they are spread across. */
function toasts(page: Page) {
  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('[data-toast-id]'));
    return {
      bodies: rows.map(row => row.textContent?.trim() ?? ''),
      viewports: new Set(rows.map(row => row.parentElement)).size,
    };
  });
}

/**
 * Toasts are the component system's own `useToast`, and Tecton does not stand
 * between a consumer and it. A toast is raised into the viewport its own
 * provider mounted, so a page with two separately bundled containers has two
 * viewports on it — one per copy of the package, each rendering the toasts of
 * the copy that raised them.
 *
 * Tecton v1 routed toast *data* across copies so that one viewport showed them
 * all (F8/F12 in `docs/engineering/micro-frontends/analysis.md`). That routing
 * hung off a Tecton-owned `useToast` whose payload was strings rather than
 * elements, and a Tecton-owned hook is exactly what v2 removed: the toast API
 * is the component system's, with the component system's `ToastOptions`, whose
 * `body` is a `ReactNode` — and an element built by one copy's React cannot be
 * rendered by another's. So the routing is gone with it, and the viewports it
 * merged are visible again. `docs/design/fidelity-report.md` records the
 * trade.
 *
 * What does still hold is everything the root registry owns: the page's mode,
 * its theme name and the fact that a container leaving does not take them
 * away. Those are asserted throughout the rest of this file.
 */
test('every container’s toasts land in its own provider’s viewport', async ({
  page,
}) => {
  await open(page, '?styles=full&mount=ab');

  await page.click('[data-testid="a-raise-toast"]');
  await page.click('[data-testid="b-raise-toast"]');
  await page.waitForTimeout(200);

  const shown = await toasts(page);
  expect(shown.bodies.join(' ')).toContain('toast from container a');
  expect(shown.bodies.join(' ')).toContain('toast from container b');
  // One viewport per copy of the package on the page.
  expect(shown.viewports).toBe(2);
});

test('a nested container still shows its toasts', async ({page}) => {
  // The recommended split shape: the shell owns the page through
  // configureTectonRoot() and BOTH containers are nested. A nested provider is
  // still a provider — it mounts the layer its own tree resolves toasts
  // through — so nothing queues for ever.
  await open(page, '?styles=split');

  await page.click('[data-testid="a-raise-toast"]');
  await page.click('[data-testid="b-raise-toast"]');
  await page.waitForTimeout(200);

  const shown = await toasts(page);
  expect(shown.bodies.join(' ')).toContain('toast from container a');
  expect(shown.bodies.join(' ')).toContain('toast from container b');

  // Being nested claims nothing else: the shell still owns the root, and the
  // page still has the same three holders it had before.
  expect(await registry(page)).toMatchObject({holders: 3});
  expect(await root(page)).toMatchObject({mode: 'dark', theme: 'tecton'});
});

test('a container that leaves takes its own viewport with it', async ({
  page,
}) => {
  await open(page, '?styles=split');

  await page.click('[data-testid="a-raise-toast"]');
  await page.waitForTimeout(200);
  expect((await toasts(page)).bodies.join(' ')).toContain(
    'toast from container a',
  );

  // A container being unmounted is routine in a shell.
  await page.evaluate(() => window.__mfe.unmount('a'));
  await page.waitForTimeout(100);

  await page.click('[data-testid="b-raise-toast"]');
  await page.waitForTimeout(200);

  const shown = await toasts(page);
  expect(shown.bodies.join(' ')).toContain('toast from container b');
  expect(shown.bodies.join(' ')).not.toContain('toast from container a');
  expect(shown.viewports).toBe(1);
});

// ---------------------------------------------------------------------------
// The cascade: recorded, not fixed
// ---------------------------------------------------------------------------

test('two full bundles: the last-loaded theme wins for every container', async ({
  page,
}) => {
  await open(page, '?styles=full&only=a');
  const aAlone = await container(page, 'a');
  await open(page, '?styles=full&only=b');
  const bAlone = await container(page, 'b');
  expect(aAlone?.accent).not.toBe(bAlone?.accent);

  await open(page, '?styles=full&css=ab&mount=ab');
  const ab = {a: await container(page, 'a'), b: await container(page, 'b')};
  await open(page, '?styles=full&css=ba&mount=ab');
  const ba = {a: await container(page, 'a'), b: await container(page, 'b')};

  // Documented, not fixed: both sheets scope their tokens to the same theme
  // name in the same layer, so source order decides — for BOTH containers.
  // Container A, a released artefact nobody touched, renders in B's accent
  // just because B is linked after it (analysis.md F2).
  expect(ab.a?.accent).toBe(bAlone?.accent);
  expect(ab.b?.accent).toBe(bAlone?.accent);
  expect(ba.a?.accent).toBe(aAlone?.accent);
  expect(ba.b?.accent).toBe(aAlone?.accent);

  // The theme covers the whole token set in both versions (the build's
  // token-coverage manifest enforces that), so there is no token left for one
  // version to win by default — the load order decides all of them together.
  expect(ab.a?.surface).toBe(ab.b?.surface);
  expect(ba.a?.surface).toBe(ba.b?.surface);

  // And the theme's per-component overrides go the same way as its tokens,
  // for the same reason: one theme name, one scope, one layer. A's card and
  // B's card both take the padding of whichever sheet was linked last.
  expect(aAlone?.panelPadding).toBe('15px');
  expect(bAlone?.panelPadding).toBe('31px');
  expect(ab.a?.panelPadding).toBe(bAlone?.panelPadding);
  expect(ab.b?.panelPadding).toBe(bAlone?.panelPadding);
  expect(ba.a?.panelPadding).toBe(aAlone?.panelPadding);
  expect(ba.b?.panelPadding).toBe(aAlone?.panelPadding);

  // And the layer order is fixed by the statement line, not by arrival.
  for (const order of ['ab', 'ba']) {
    await open(page, `?styles=full&css=${order}`);
    const statements = await layerStatements(page);
    expect(statements.length).toBeGreaterThanOrEqual(2);
    for (const entry of statements) {
      expect(entry.statement).toEqual(['reset', 'astryx-base', 'astryx-theme']);
    }
  }

  test.info().annotations.push({
    type: 'measured',
    description: `accent with css=ab → A:${ab.a?.accent} B:${ab.b?.accent}; with css=ba → A:${ba.a?.accent} B:${ba.b?.accent}`,
  });
});
