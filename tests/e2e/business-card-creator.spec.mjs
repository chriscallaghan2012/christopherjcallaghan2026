import { test, expect } from '@playwright/test';

test('business card studio offers premium templates, correct sizes and print exports', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tools/business-card-creator');
  await expect(page.getByRole('heading', { name: 'Business Card Studio.' })).toBeVisible();
  await expect(page.getByText('Business Advisor & Full-Stack Developer')).toBeVisible();

  for (const template of ['Crimson Executive', 'Swiss Minimal', 'Ember Studio', 'Monogram Luxe', 'Split Consultant', 'Signal Grid']) {
    await expect(page.getByRole('button', { name: new RegExp(template) })).toBeVisible();
  }

  const name = page.getByRole('textbox', { name: 'Name', exact: true });
  await name.fill('Alex Example');
  await expect(page.locator('.business-card-preview svg')).toContainText('Alex Example');

  await expect(page.getByText('85 × 55 mm trim size')).toBeVisible();
  await expect(page.locator('.business-card-preview svg')).toHaveAttribute('width', '85mm');
  await expect(page.locator('.business-card-preview svg')).toHaveAttribute('height', '55mm');

  const pngPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG' }).click();
  const png = await pngPromise;
  expect(png.suggestedFilename()).toMatch(/uk-crimson-executive-front-3mm-bleed\.png$/);

  const svgPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SVG' }).click();
  const svg = await svgPromise;
  expect(svg.suggestedFilename()).toMatch(/uk-crimson-executive-front-3mm-bleed\.svg$/);

  await page.getByRole('button', { name: 'US standard' }).click();
  await expect(page.getByText('3.5 × 2 in trim size')).toBeVisible();
  await expect(page.locator('.business-card-preview svg')).toHaveAttribute('width', '88.9mm');
  await expect(page.locator('.business-card-preview svg')).toHaveAttribute('height', '50.8mm');

  await page.getByRole('button', { name: 'Monogram Luxe' }).click();
  await expect(page.getByRole('heading', { name: 'Monogram Luxe' })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('.business-card-preview svg')).toContainText('STRATEGY  /  TECHNOLOGY  /  GROWTH');

  await expect(page.getByRole('button', { name: 'Print / Save PDF' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.business-card-preview svg')).toBeVisible();
  await expect(page.locator('.print-hide').first()).toBeHidden();
});

test('business card studio remains within a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/business-card-creator');
  await expect(page.getByRole('heading', { name: 'Business Card Studio.' })).toBeVisible();
  await expect(page.getByLabel('Phone / WhatsApp number')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Crimson Executive' })).toBeVisible();

  const widths = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport + 1);

  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('.business-card-preview svg')).toContainText('TECHNOLOGY. STRATEGY. GROWTH.');
});
