import { test, expect } from '@playwright/test';

test('business card creator edits details, switches sides and exports artwork', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tools/business-card-creator');
  await expect(page.getByRole('heading', { name: 'Business Card Creator' })).toBeVisible();
  await expect(page.getByText('Business Advisor & Full-Stack Developer')).toBeVisible();

  const name = page.getByLabel('Name');
  await name.fill('Alex Example');
  await expect(page.getByText('Alex Example', { exact: true })).toBeVisible();

  const pngPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG' }).click();
  const png = await pngPromise;
  expect(png.suggestedFilename()).toMatch(/\.png$/);

  const svgPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SVG' }).click();
  const svg = await svgPromise;
  expect(svg.suggestedFilename()).toMatch(/\.svg$/);

  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByText('Technology. Strategy. Growth.')).toBeVisible();

  await page.getByRole('button', { name: 'Print / Save PDF' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.business-card-preview svg')).toBeVisible();
  await expect(page.locator('.print-hide').first()).toBeHidden();
});

test('business card creator remains within a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/business-card-creator');
  await expect(page.getByRole('heading', { name: 'Business Card Creator' })).toBeVisible();
  await expect(page.getByLabel('Phone / WhatsApp number')).toBeVisible();
  const widths = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport + 1);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByText('Technology. Strategy. Growth.')).toBeVisible();
});
