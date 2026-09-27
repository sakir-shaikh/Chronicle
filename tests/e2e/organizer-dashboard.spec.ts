import { test, expect } from '@playwright/test';

test.describe('Organizer Dashboard & Analytics', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display and filter events correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Events' })).toBeVisible();

    const liveTab = page.getByRole('button', { name: /Live/ });
    await liveTab.click();
    await expect(page.getByText('Future of AI Summit 2026')).toBeVisible();

    const upcomingTab = page.getByRole('button', { name: /Upcoming/ });
    await upcomingTab.click();
    await expect(upcomingTab).toHaveClass(/text-\[#20302A\] font-medium/);
  });

  test('should search events by title and location', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search events...');
    await searchInput.fill('Future of AI Summit');
    await expect(page.getByText('Future of AI Summit 2026')).toBeVisible();

    await searchInput.fill('XYZNonExistentEventXYZ');
    await expect(page.getByRole('heading', { name: 'No events found' })).toBeVisible();
  });

  test('should show zero-state when no events are present', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search events...');
    await searchInput.fill('XYZNonExistentEventXYZ');
    await expect(page.getByRole('heading', { name: 'No events found' })).toBeVisible();
    
    await expect(page.getByRole('button', { name: 'Create Event' }).nth(1)).toBeVisible();
  });

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('chronicle_events_data_v1', JSON.stringify({ bad: 'data' }));
    });
    await page.reload();
    
    await expect(page.getByRole('heading', { name: 'Your Events' })).toBeVisible();
    await expect(page.getByText('Future of AI Summit 2026')).toBeVisible();

    await page.addInitScript(() => {
      localStorage.setItem('chronicle_events_data_v1', JSON.stringify([]));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'No events found' })).toBeVisible();
  });

  test('should handle long event titles gracefully', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('chronicle_events_data_v1', JSON.stringify([{
        id: '1',
        title: 'This is a very very very long event title that might break the layout if not truncated properly or handled correctly in the flex layout of the dashboard and analytics view',
        status: 'live',
        date: 'Oct 15, 2024',
        location: 'Remote',
        organizer: 'Test Org',
        stats: { attendees: 10 }
      }]));
    });
    await page.reload();
    await expect(page.getByText('This is a very very very long event title')).toBeVisible();
  });

  test('EventOverviewAnalytics - missing stats handled without crashing', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('chronicle_events_data_v1', JSON.stringify([{
        id: '1',
        title: 'No Stats Event',
        status: 'live',
        date: 'Oct 15, 2024',
        location: 'Remote',
        organizer: 'Test Org',
        slug: 'no-stats-event'
      }]));
    });
    await page.reload();
    
    await page.getByText('No Stats Event').click();
    await expect(page.getByRole('heading', { name: 'No Stats Event' })).toBeVisible();
    
    const totalAttendeesLocator = page.locator('text=Total Attendees').locator('..').locator('.tabular-nums');
    await expect(totalAttendeesLocator).toContainText('0');
  });

  test('EventOverviewAnalytics - should trigger CSV export without crashing', async ({ page }) => {
    await page.getByText('Future of AI Summit 2026').click();
    
    const downloadPromise = page.waitForEvent('download');
    
    await page.getByRole('button', { name: 'Download CSV Summary' }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('chronicle-report.csv');
  });

});
