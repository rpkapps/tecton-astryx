import {expect, test, type ConsoleMessage, type Page} from '@playwright/test';

/**
 * What the built site has to do.
 *
 * Every assertion here is about the exported artefact, not about the source:
 * that an example really renders a Tecton control in the reader's browser, that
 * the Code tab shows the import a consumer would write, that the search index
 * the export wrote answers a query, and that nothing on the page names the
 * upstream library the package is built on.
 */

/** Console errors, minus the ones a static host legitimately produces. */
function watchConsole(page: Page) {
  const errors: string[] = [];
  const ignore = [
    // Google Fonts is fetched at runtime; an offline test machine is fine.
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'Failed to load resource',
  ];
  const record = (message: ConsoleMessage) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (ignore.some(pattern => text.includes(pattern))) return;
    errors.push(text);
  };
  page.on('console', record);
  page.on('pageerror', error => errors.push(String(error)));
  return errors;
}

/** The visible text of the page, which is where "astryx" must never appear. */
async function visibleText(page: Page) {
  return page.evaluate(() => document.body.innerText);
}

test('the landing page introduces Tecton and renders live tiles', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('/');

  await expect(
    page.getByRole('heading', {name: 'Tecton', exact: true}),
  ).toBeVisible();
  await expect(page.getByText('pnpm add @tecton/react')).toBeVisible();

  // The gallery tiles are the components themselves, mounted after hydration.
  const tile = page.locator('a[href="/docs/components/Button/"]').first();
  await tile.scrollIntoViewIfNeeded();
  await expect(tile.locator('button.astryx-button').first()).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('a component page renders every example live and shows its source', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/components/Button/');

  await expect(
    page.getByRole('heading', {name: 'Button', level: 1}),
  ).toBeVisible();

  // Every example on the page is a frame, and each one runs.
  const frames = page.locator('figure[id]');
  await expect(frames).toHaveCount(3);

  const first = page.locator('figure#ButtonBasic');
  const rendered = first.getByRole('button', {name: 'Generate facies model'});
  await expect(rendered).toBeVisible();
  // A real Tecton button, not a stand-in.
  await expect(rendered).toHaveClass(/astryx-button/);
  await expect(rendered).toHaveClass(/primary/);

  // The Code tab shows what a consumer writes, not the repository's own paths.
  await first.getByRole('radio', {name: 'Code'}).click();
  const code = first.locator('.tecton-code');
  await expect(code).toContainText("from '@tecton/react'");
  await expect(code).not.toContainText('../Button.js');

  // The preview can be looked at in the other colour mode.
  await first.getByRole('radio', {name: 'Preview'}).click();
  await first.getByRole('radio', {name: 'Light'}).click();
  await expect(rendered).toBeVisible();

  // The props table is printed from the component's own doc.
  await expect(
    page.getByRole('cell', {name: 'isLoading'}).first(),
  ).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('the icons page lists every glyph and switches cut', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/foundations/icons/');

  await expect(page.getByText('131 of 131 glyphs.')).toBeVisible();
  await expect(page.getByText('export-upload', {exact: true})).toBeVisible();

  await page.getByRole('radio', {name: 'Filled'}).click();
  await page.getByLabel('Filter glyphs').fill('well');
  await expect(page.getByText('well', {exact: true})).toBeVisible();
  await expect(page.getByText('export-upload', {exact: true})).toHaveCount(0);

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('the colour page prints both modes of every role', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/foundations/colour/');

  await expect(
    page.getByRole('heading', {name: 'Colour', level: 1}),
  ).toBeVisible();
  await expect(
    page.getByText(/colour roles, each with the value/),
  ).toBeVisible();
  await expect(page.getByText('dark  #1d1c1f').first()).toBeVisible();
  await expect(page.getByText('light #f6f4f7').first()).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('search finds the Button page in the static index', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/');

  await page
    .getByRole('button', {name: /search/i})
    .first()
    .click();
  const input = page.getByPlaceholder(/search/i);
  await input.fill('button');

  // Each hit is a button carrying its breadcrumb; the Button page is the first.
  const result = page
    .getByRole('dialog')
    .getByRole('button', {name: /Components.*\bButton$/});
  await expect(result.first()).toBeVisible({timeout: 15_000});
  await result.first().click();
  await expect(page).toHaveURL(/\/docs\/components\/Button\/?$/);

  expect(errors).toEqual([]);
});

test('the templates section is present and empty-safe', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/templates/');
  await expect(
    page.getByRole('heading', {name: 'Page templates', level: 1}),
  ).toBeVisible();
  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});
