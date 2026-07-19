import { test, expect } from '@playwright/test';

test.describe('Home Flow', () => {
  test('browsing home and navigating to detail', async ({ page }) => {
    // Mock the Supabase fetch API to ensure reliable testing without a DB
    await page.route('**/rest/v1/karya?*', async (route) => {
      const url = new URL(route.request().url());
      
      // If fetching detail
      if (url.searchParams.has('id')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'mock-id-123',
            judul: 'Karya E2E Test',
            deskripsi: 'Deskripsi lengkap karya E2E test',
            nama_mahasiswa: 'E2E User',
            kategori: { nama: 'Web' },
            status: 'published',
            karya_media: [
              { url: 'https://placehold.co/600x400.webp', tipe: 'image', urutan: 0 }
            ],
            view_count: 100,
            created_at: new Date().toISOString()
          }])
        });
        return;
      }

      // If fetching feed
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'mock-id-123',
            judul: 'Karya E2E Test',
            nama_mahasiswa: 'E2E User',
            prodi: 'Informatika',
            view_count: 100,
            created_at: new Date().toISOString(),
            kategori: { nama: 'Web', slug: 'web' },
            karya_media: [
              { url: 'https://placehold.co/600x400.webp', tipe: 'image', urutan: 0 }
            ]
          }
        ])
      });
    });

    // Mock category API
    await page.route('**/rest/v1/kategori?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'cat-1', nama: 'Web', slug: 'web' }
        ])
      });
    });

    await page.goto('/home');

    // Wait for feed to load and check if title exists
    await expect(page.getByText('Karya E2E Test').first()).toBeVisible();
    await expect(page.getByText('E2E User').first()).toBeVisible();

    // Click on the card to navigate
    await page.click('text=Karya E2E Test');

    // Should navigate to detail
    await expect(page).toHaveURL(/.*\/karya\/mock-id-123/);
    
    // In detail page
    await expect(page.getByText('Deskripsi lengkap karya E2E test')).toBeVisible();
  });
});
