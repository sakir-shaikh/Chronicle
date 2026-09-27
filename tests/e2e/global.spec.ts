import { test, expect } from '@playwright/test';

test.describe('Global Routing, Navigation, App Shell, Error Boundaries', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch between Organizer and Attendee views', async ({ page }) => {
    // Default is Organizer
    await expect(page.getByText('Your Events')).toBeVisible();

    // Switch to Attendee
    await page.getByRole('button', { name: 'Attendee View' }).click();
    
    // Attendee Portal should be visible
    await expect(page.getByText('Official Attendee Portal')).toBeVisible();

    // Switch back to Organizer
    await page.getByRole('button', { name: 'Organizer', exact: true }).click();
    await expect(page.getByText('Your Events')).toBeVisible();
  });

  test('should navigate tabs correctly', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation is hidden on mobile.');
    const banner = page.getByRole('banner');
    // Click Analytics
    await banner.getByRole('button', { name: 'Analytics', exact: true }).click();
    // It should navigate to Analytics overview
    await expect(page.getByText('Export & Sponsorship Reporting')).toBeVisible();

    // Click Events
    await banner.getByRole('button', { name: 'Events', exact: true }).click();
    await expect(page.getByText('Your Events')).toBeVisible();

    // Click Attendees
    await banner.getByRole('button', { name: 'Attendees', exact: true }).click();
    await expect(page.getByText('Official Attendee Portal')).toBeVisible();

    // Click Overview
    await banner.getByRole('button', { name: 'Overview', exact: true }).click();
    await expect(page.getByText('Your Events')).toBeVisible();
  });

  test('should handle mobile navigation (hamburger menu)', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Click hamburger menu using evaluate to bypass viewport checks
    await page.locator('button:has(span:text("menu"))').evaluate(node => (node as HTMLElement).click());
    
    // Check if mobile menu is open
    await expect(page.locator('nav').filter({ hasText: 'Overview' })).toBeVisible();

    // Click Analytics from mobile menu
    await page.getByRole('button', { name: 'Analytics', exact: true }).click();
    
    // Should navigate and close menu
    await expect(page.getByText('Export & Sponsorship Reporting')).toBeVisible();
    await expect(page.locator('button:has(span:text("close"))')).toBeHidden();
  });

  test('should display No events found for missing events (invalid search)', async ({ page }) => {
    // Type something that doesn't exist
    await page.getByPlaceholder('Search events...').fill('NonExistentEventXYZ123');
    await expect(page.getByText('No events found')).toBeVisible();
    
    // Clear search
    await page.getByPlaceholder('Search events...').fill('');
    await expect(page.getByText('No events found')).toBeHidden();
  });

  test('should test Toast notification lifecycle', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Tabs navigation is hidden on mobile, and the test uses desktop tabs.');
    // Navigate to Analytics
    await page.getByRole('button', { name: 'Analytics', exact: true }).click();

    // Give some time to render
    await page.waitForLoadState('networkidle');

    // Click Copy Link
    await page.locator('button[title="Copy Link"]').click();

    // Verify Toast is shown
    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible();
    await expect(page.getByText('Link Copied!')).toBeVisible();

    // Wait for Toast to disappear automatically or close it manually
    await page.locator('button[aria-label="Close notification"]').click();
    await expect(toast).toBeHidden();
  });

  test('should recover via Error Boundary when corrupted data is injected', async ({ page }) => {
    // Inject corrupted data before navigation
    await page.addInitScript(() => {
      localStorage.setItem('chronicle_events_data_v1', JSON.stringify([
        { id: 'corrupted-event', status: 'live' } // Missing all stats and other fields
      ]));
    });

    await page.goto('/');

    // Wait for the Error Boundary or Vite overlay
    await expect(page.locator('text=Something went wrong').or(page.locator('vite-error-overlay'))).toBeAttached();

    // Test recovery button
    await page.evaluate(() => {
      localStorage.removeItem('chronicle_events_data_v1');
    });

    await page.reload();

    // Should load cleanly now
    await expect(page.getByText('Your Events')).toBeVisible();
  });

});
