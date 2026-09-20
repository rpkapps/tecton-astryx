import {expect, test, type ConsoleMessage, type Page} from '@playwright/test';

/**
 * What the built site has to do.
 *
 * Every assertion here is about the exported artefact, not about the source:
 * that an example really renders a Tecton control in the reader's browser, that
 * the Code tab shows the import a consumer would write, that the grouped
 * sidebar opens, that the search index the export wrote answers a query, and
 * that nothing a reader sees names the upstream library.
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

/**
 * The visible text of the page, with the three things a reader is allowed to
 * meet of the upstream name removed: the message-id namespace and the class and
 * attribute names the components carry, all of which a consumer reads or writes
 * verbatim. Anything else naming the library is a leak.
 */
async function visibleText(page: Page) {
  const text = await page.evaluate(() => document.body.innerText);
  return text.replace(
    /@astryx\.[A-Za-z0-9_.]+|data-astryx[a-z0-9-]*|astryx-[a-z0-9-]+/g,
    '',
  );
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
  const tile = page.locator('[data-component="Button"]').first();
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

  // The showcase leads the page, and every example below it is its own frame.
  const frames = page.locator('figure[id]');
  expect(await frames.count()).toBeGreaterThan(3);

  const showcase = page.locator('figure#ButtonShowcase');
  const rendered = showcase.getByRole('button', {name: 'Primary'});
  await expect(rendered).toBeVisible();
  // A real Tecton button, not a stand-in.
  await expect(rendered).toHaveClass(/astryx-button/);

  // The Code tab shows what a consumer writes, verbatim from the example file.
  await showcase.getByRole('button', {name: 'Code', exact: true}).click();
  const code = showcase.locator('.tecton-code');
  await expect(code).toContainText("from '@tecton/react/Button'");

  // The preview can be looked at in the other colour mode.
  await showcase.getByRole('button', {name: 'Light'}).click();
  await expect(rendered).toBeVisible();

  // The playground renders the component from the doc's own defaults.
  await expect(page.getByRole('heading', {name: 'Playground'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Click me'})).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('a component page prints the props of every part it is made of', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/components/Table/');

  await expect(page.getByRole('heading', {name: 'Parts'})).toBeVisible();
  await expect(
    page.getByRole('heading', {name: 'Table Header Cell'}),
  ).toBeVisible();
  // A part's own signature, printed from the part's own doc.
  await expect(page.locator('h3#usetableselection')).toBeVisible();
  await expect(
    page.getByRole('cell', {name: 'getIsItemSelected'}).first(),
  ).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});

test('the component sidebar is grouped and opens', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/components/');

  const sidebar = page.locator('#nd-sidebar');
  // Utilities is a group, collapsed until it is asked for.
  const utilities = sidebar.getByRole('button', {name: 'Utilities'});
  await expect(utilities).toBeVisible();
  await expect(sidebar.getByRole('link', {name: 'useClipboard'})).toHaveCount(
    0,
  );

  await utilities.click();
  await expect(sidebar.getByRole('link', {name: 'useClipboard'})).toBeVisible();

  // The group holding the page being read is already open.
  await page.goto('/docs/components/IconButton/');
  await expect(
    sidebar.getByRole('link', {name: 'Toggle Button', exact: true}),
  ).toBeVisible();

  expect(errors).toEqual([]);
});

test('the gallery groups every component by category', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/components/');

  await expect(page.getByRole('heading', {name: 'Action'})).toBeVisible();
  await expect(
    page.getByRole('heading', {name: 'Form Controls'}),
  ).toBeVisible();

  // The tile is a card whose whole surface is one link; reaching it from the
  // keyboard is the same journey a reader makes, and it proves the link is in
  // the tab order at all.
  const link = page.getByRole('link', {name: 'Button', exact: true}).first();
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/components\/Button\/?$/);

  expect(errors).toEqual([]);
});

test('the icons page lists every glyph and switches cut', async ({page}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/foundations/icons/');

  await expect(page.getByText('131 of 131 glyphs.')).toBeVisible();
  await expect(page.getByText('export-upload', {exact: true})).toBeVisible();

  await page.getByRole('button', {name: 'Filled'}).click();
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

test('the template gallery and a template page both render live', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('/docs/templates/');
  await expect(
    page.getByRole('heading', {name: 'Templates', level: 1}),
  ).toBeVisible();

  const tile = page.locator('a[href="/docs/templates/table-inbox/"]').first();
  await tile.scrollIntoViewIfNeeded();
  await expect(tile).toBeVisible();

  await page.goto('/docs/templates/table-inbox/');
  await expect(
    page.getByRole('heading', {name: 'Inbox Table', level: 1}),
  ).toBeVisible();
  // The template is the running page, not a picture of it.
  await expect(
    page.locator('figure#table-inbox .astryx-table').first(),
  ).toBeVisible();
  // …and its source is on the page.
  await expect(page.getByRole('heading', {name: 'Source'})).toBeVisible();

  expect(await visibleText(page)).not.toMatch(/astryx/i);
  expect(errors).toEqual([]);
});
