import {expect, test, type Page} from '@playwright/test';
import {sitePages} from '../src/generated/sitePages';

/**
 * Every page, every example.
 *
 * The suite in `site.spec.ts` checks the things a reader most depends on, in
 * detail, on a few pages. This one is the opposite shape: one cheap pass over
 * every page the generator wrote, asserting only what must never be untrue
 * anywhere — the page renders, each of its examples actually drew something,
 * nothing errored, and nothing on it names the upstream library.
 *
 * It is driven by the generated page list, so it grows with the package. A
 * component added to `@tecton/react` is tested here the moment it has a page.
 */

const IGNORED_ERRORS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'Failed to load resource',
];

function watch(page: Page) {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (IGNORED_ERRORS.some(pattern => text.includes(pattern))) return;
    errors.push(text);
  });
  page.on('pageerror', error => errors.push(String(error)));
  return errors;
}

/** Which example frames on this page failed to render anything. */
async function blankPreviews(page: Page) {
  return page.evaluate(() => {
    const blank: string[] = [];
    for (const figure of document.querySelectorAll('figure[id]')) {
      const stage = figure.querySelector<HTMLElement>('.tecton-stage');
      if (!stage) {
        blank.push(`${figure.id}: the frame has no preview stage`);
        continue;
      }
      if (stage.innerText.includes('No module is registered')) {
        blank.push(`${figure.id}: no module is registered for it`);
        continue;
      }
      const drew =
        stage.innerText.trim().length > 0 ||
        stage.querySelector('svg, img, canvas, input, button, [class]');
      if (!drew) blank.push(`${figure.id}: the preview stayed empty`);
    }
    return blank;
  });
}

test.describe('every generated page', () => {
  for (const entry of sitePages) {
    test(`${entry.url} renders`, async ({page}) => {
      const errors = watch(page);
      const response = await page.goto(`${entry.url}/`);
      expect(response?.status(), `${entry.url} was not served`).toBe(200);

      // The first level-1 heading is the page's title; an example may render
      // more of them, which on the Heading page is rather the point.
      await expect(page.locator('h1').first()).toHaveText(entry.title);
      // The examples mount after hydration; give the modules a moment.
      await page.waitForTimeout(400);

      expect(await blankPreviews(page)).toEqual([]);
      expect(
        await page.evaluate(() => document.body.innerText),
        `${entry.url} names the upstream library in its visible text`,
      ).not.toMatch(/astryx/i);
      expect(errors, `${entry.url} logged console errors`).toEqual([]);
    });
  }
});
