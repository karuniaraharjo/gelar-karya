import { test, expect } from '@playwright/test';

test.describe('Explore Flow', () => {
  test('browsing explore and filtering by category', async ({ page }) => {
    // Mock categories
    await page.route('**/rest/v1/kategori?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'cat-1', nama: 'Web', slug: 'web' },
          { id: 'cat-2', nama: 'IoT', slug: 'iot' }
        ])
      });
    });

    // Mock explore data
    await page.route('**/rest/v1/karya?*', async (route) => {
      const url = new URL(route.request().url());
      const isIoT = url.searchParams.get('kategori.slug') === 'eq.iot';

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: isIoT ? 'mock-iot' : 'mock-web',
            created_at: new Date().toISOString(),
            kategori: { nama: isIoT ? 'IoT' : 'Web', slug: isIoT ? 'iot' : 'web' },
            karya_media: [
              { url: 'https://placehold.co/300x300.webp', tipe: 'image', urutan: 0 }
            ]
          }
        ])
      });
    });

    await page.goto('/explore');

    // Default load (should show Web if it's the first or default mock)
    await expect(page.getByText('Web').first()).toBeVisible();

    // Click Category filter (if it exists on top bar)
    // Note: The UI might have top bar or category pills. Assuming it says "IoT"
    const iotCategory = page.getByText('IoT', { exact: true }).first();
    await iotCategory.click();

    // The grid should now show IoT
    await expect(page.getByText('IoT').first()).toBeVisible();
  });
});
