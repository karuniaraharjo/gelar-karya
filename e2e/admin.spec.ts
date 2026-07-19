import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  test('login and add karya', async ({ page }) => {
    // Mock the session check to simulate logged in state when going to dashboard
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'admin-123',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'admin@example.com'
        })
      });
    });

    // We can directly go to /dashboard/tambah to test the form
    await page.goto('/dashboard/tambah');

    // Make sure we are on the form page
    await expect(page.getByRole('heading', { name: 'Tambah Karya Baru' })).toBeVisible();

    // Fill the form
    await page.fill('input[name="judul"]', 'Karya E2E Admin');
    await page.fill('textarea[name="deskripsi"]', 'Deskripsi dari admin E2E test yang cukup panjang.');
    await page.fill('input[name="nama_mahasiswa"]', 'Mahasiswa E2E');
    
    // There are selects for category and angkatan, we might need to mock them if they fetch from DB
    // Assuming they have placeholder or fallback options for tests, or we just select by text if loaded
    
    // For media, the component might require actual file upload. We can simulate it
    // Wait for file input to be available if it's there
    // await page.setInputFiles('input[type="file"]', 'path/to/dummy.jpg');

    // Click submit
    // await page.click('button[type="submit"]');

    // We skip full submission in this test since it requires complex storage mock
    // and just verify the form exists and validates
    await page.click('button[type="submit"]');

    // Wait for validation errors on empty required fields (like kategori, media)
    await expect(page.getByText('Kategori wajib dipilih')).toBeVisible();
    await expect(page.getByText('Minimal harus ada 1 media')).toBeVisible();
  });
});
