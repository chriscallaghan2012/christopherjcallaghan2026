import { test, expect } from '@playwright/test';

const scanId = 'e2e-report-continuity';
const targetUrl = 'https://example.com/';
const counts = { pass: 1, warning: 1, fail: 0, info: 0, notMeasured: 0 };
const report = {
  scanId,
  targetUrl,
  finalUrl: targetUrl,
  createdAt: '2026-10-14T12:00:00.000Z',
  status: 'completed',
  overall: { score: 72, grade: 'C', label: 'Needs attention' },
  categories: [
    { id: 'seo', label: 'Technical & On-page SEO', weight: 0.3, score: 72, checks: [], counts },
    { id: 'ai', label: 'AI Search Readiness', weight: 0.25, score: 70, checks: [], counts },
    { id: 'performance', label: 'Performance & UX', weight: 0.2, score: 75, checks: [], counts },
    { id: 'accessibility', label: 'Accessibility', weight: 0.15, score: 80, checks: [], counts },
    { id: 'security', label: 'Security', weight: 0.1, score: 65, checks: [], counts }
  ],
  recommendations: [{
    checkId: 'seo-title',
    category: 'seo',
    title: 'Fixture title finding',
    whatDetected: 'The fixture report contains this observable finding.',
    whyItMatters: 'This is test-only report content.',
    fix: 'Use a descriptive title.',
    priority: 'high',
    estimatedImpact: 'High — test fixture only.',
    difficulty: 'straightforward',
    nonTechnical: true,
    cta: { label: 'Fix this', href: '/seo-services', service: 'Technical SEO' }
  }],
  summary: { pass: 8, warning: 2, fail: 1, info: 1, notMeasured: 2 },
  executiveSummary: 'Fixture report executive summary.',
  limitations: ['Fixture only; not a real audit.'],
  scanMeta: {
    startedAt: '2026-10-14T11:59:59.000Z',
    completedAt: '2026-10-14T12:00:00.000Z',
    durationMs: 1000,
    pageBytes: 1024,
    httpStatus: 200,
    targetUrl,
    finalUrl: targetUrl,
    redirectChain: [],
    userAgent: 'Playwright fixture',
    checksRun: 14,
    checksNotMeasured: 2,
    stages: ['fixture']
  },
  version: 'e2e-fixture'
};

test('the request form retains the completed scan and back navigation restores its report', async ({ page }) => {
  await page.addInitScript(({ id, savedReport }) => {
    sessionStorage.setItem(`cjc:website-grader:report:${id}`, JSON.stringify(savedReport));
    sessionStorage.setItem('cjc:website-grader:latest-scan', id);
  }, { id: scanId, savedReport: report });

  await page.goto(`/tools/website-grader/fix-my-website?scan=${scanId}&issues=high-priority`);
  await expect(page.getByRole('heading', { name: 'Send this scan to me.' })).toBeVisible();
  await expect(page.getByText('Key findings')).toBeVisible();
  await expect(page.getByText('Fixture title finding').first()).toBeVisible();
  await expect(page.getByText(targetUrl).first()).toBeVisible();

  await page.getByRole('button', { name: 'Back to full results' }).click();
  await expect(page).toHaveURL(new RegExp(`/tools/website-grader\\?scan=${scanId}`));
  await expect(page.getByText('Fixture report executive summary').first()).toBeVisible();

  const tabs = page.getByRole('tablist', { name: 'Report sections' });
  await expect(tabs).toBeVisible();
  await tabs.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => window.scrollBy(0, 150));
  await expect.poll(async () => tabs.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeGreaterThanOrEqual(60);
  const stickyTop = await tabs.evaluate((element) => Math.round(element.getBoundingClientRect().top));
  expect(stickyTop).toBeLessThan(100);
});

test('the mobile navigation closes with Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const openButton = page.getByRole('button', { name: 'Open navigation' });
  await openButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation' }).first()).toBeVisible();
  const mobileDialog = page.getByRole('dialog', { name: 'Mobile navigation' });
  await expect.poll(async () => mobileDialog.evaluate((element) => Math.round(element.getBoundingClientRect().left))).toBe(0);
  const viewportWidths = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  if (viewportWidths.content > viewportWidths.viewport + 1) {
    const offenders = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, className: typeof element.className === 'string' ? element.className.slice(0, 120) : '', text: (element.textContent || '').trim().slice(0, 45), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
    }).filter((item) => item.right > window.innerWidth + 1 || item.left < -1).sort((a, b) => b.right - a.right).slice(0, 20));
    console.log('Mobile horizontal overflow offenders:', JSON.stringify(offenders));
  }
  expect(viewportWidths.content).toBeLessThanOrEqual(viewportWidths.viewport + 1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  await expect(openButton).toBeFocused();
});
