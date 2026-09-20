/**
 * Two independently built versions of `@tecton/react` on one page.
 *
 * Three of these tests assert a mitigation that Phase 3 shipped; the last two
 * record what the cascade does, because the cascade is not something a wrapper
 * can fix — it is a property of the page, and the documented rule is to make
 * it deterministic rather than to pretend it is not there.
 *
 * The findings this file is anchored to are in
 * `docs/engineering/micro-frontends/analysis.md`; the model the split test
 * exercises is in `docs/engineering/micro-frontends/README.md`.
 */
import {test, expect, type Page} from '@playwright/test';

declare global {
  interface Window {
    /** The host shell's driving API; see `host/mfe-page.html`. */
    __mfe: {
      mount(id: string, opts?: {mode?: string; scope?: string}): void;
      unmount(id: string): void;
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

  // ...while the container it serves is still completely themed.
  expect(panel?.panelBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(panel?.panelPadding).toBe('16px');
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

  // Component styles stay each version's own: A's Panel keeps its padding and
  // B's keeps the retuned one, because the atomic class name is a hash of the
  // declaration.
  expect(a?.panelPadding).toBe('16px');
  expect(b?.panelPadding).toBe('32px');

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

  // Component styles are version-safe in every configuration.
  for (const shape of [ab, ba]) {
    expect(shape.a?.panelPadding).toBe('16px');
    expect(shape.b?.panelPadding).toBe('32px');
  }

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
