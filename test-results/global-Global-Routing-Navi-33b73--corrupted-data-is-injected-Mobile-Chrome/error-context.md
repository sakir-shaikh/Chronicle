# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global.spec.ts >> Global Routing, Navigation, App Shell, Error Boundaries >> should recover via Error Boundary when corrupted data is injected
- Location: tests\e2e\global.spec.ts:93:3

# Error details

```
Error: expect(locator).toBeAttached() failed

Locator: locator('text=Something went wrong').or(locator('vite-error-overlay'))
Expected: attached
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeAttached" locator('text=Something went wrong').or(locator('vite-error-overlay')) with timeout 5000ms
  - waiting for locator('text=Something went wrong').or(locator('vite-error-overlay'))

```

```yaml
- banner:
  - button "Chronicle Turn moments into stories":
    - img
    - text: Chronicle Turn moments into stories
  - button "Organizer"
  - button "Attendee View"
  - button "help"
  - button "notifications"
  - button "Arjun Mehta expand_more":
    - img "Arjun Mehta"
    - text: expand_more
  - button "menu"
- main:
  - text: Organizer Workspace
  - heading "Your Events" [level=1]
  - button "tune"
  - button "add Create Event"
  - text: Active Experiences 1 Live Now Total Attendees 0 north_east 14% Avg. Conversion 69.8%
  - button "All Events 1"
  - button "Live 1"
  - button "Upcoming 0"
  - button "Completed 0"
  - text: search
  - textbox "Search events..."
  - img
  - text: Live ·
  - heading [level=2]
  - button "link"
  - button "open_in_new"
  - button "Manage"
- contentinfo:
  - text: © 2026 Chronicle Intelligence & Storytelling Platform
  - link "System Status":
    - /url: "#system-status"
  - link "API Docs":
    - /url: "#api-docs"
  - link "Privacy Policy":
    - /url: "#privacy-policy"
```

# Test source

```ts
  6   |     await page.goto('/');
  7   |   });
  8   | 
  9   |   test('should switch between Organizer and Attendee views', async ({ page }) => {
  10  |     // Default is Organizer
  11  |     await expect(page.getByText('Your Events')).toBeVisible();
  12  | 
  13  |     // Switch to Attendee
  14  |     await page.getByRole('button', { name: 'Attendee View' }).click();
  15  |     
  16  |     // Attendee Portal should be visible
  17  |     await expect(page.getByText('Official Attendee Portal')).toBeVisible();
  18  | 
  19  |     // Switch back to Organizer
  20  |     await page.getByRole('button', { name: 'Organizer', exact: true }).click();
  21  |     await expect(page.getByText('Your Events')).toBeVisible();
  22  |   });
  23  | 
  24  |   test('should navigate tabs correctly', async ({ page, isMobile }) => {
  25  |     test.skip(isMobile, 'Desktop navigation is hidden on mobile.');
  26  |     // Click Analytics
  27  |     await page.getByRole('button', { name: 'Analytics' }).click();
  28  |     // It should navigate to Analytics overview
  29  |     await expect(page.getByText('Export & Sponsorship Reporting')).toBeVisible();
  30  | 
  31  |     // Click Events
  32  |     await page.getByRole('button', { name: 'Events' }).click();
  33  |     await expect(page.getByText('Your Events')).toBeVisible();
  34  | 
  35  |     // Click Attendees
  36  |     await page.getByRole('button', { name: 'Attendees' }).click();
  37  |     await expect(page.getByText('Official Attendee Portal')).toBeVisible();
  38  | 
  39  |     // Click Overview
  40  |     await page.getByRole('button', { name: 'Overview' }).click();
  41  |     await expect(page.getByText('Your Events')).toBeVisible();
  42  |   });
  43  | 
  44  |   test('should handle mobile navigation (hamburger menu)', async ({ page }) => {
  45  |     // Set viewport to mobile size
  46  |     await page.setViewportSize({ width: 375, height: 667 });
  47  | 
  48  |     // Click hamburger menu (force click if obscured by sticky header)
  49  |     await page.locator('button:has(span:text("menu"))').click({ force: true });
  50  |     
  51  |     // Check if mobile menu is open
  52  |     await expect(page.locator('nav').filter({ hasText: 'Overview' })).toBeVisible();
  53  | 
  54  |     // Click Analytics from mobile menu
  55  |     await page.getByRole('button', { name: 'Analytics', exact: true }).click();
  56  |     
  57  |     // Should navigate and close menu
  58  |     await expect(page.getByText('Export & Sponsorship Reporting')).toBeVisible();
  59  |     await expect(page.locator('button:has(span:text("close"))')).toBeHidden();
  60  |   });
  61  | 
  62  |   test('should display No events found for missing events (invalid search)', async ({ page }) => {
  63  |     // Type something that doesn't exist
  64  |     await page.getByPlaceholder('Search events...').fill('NonExistentEventXYZ123');
  65  |     await expect(page.getByText('No events found')).toBeVisible();
  66  |     
  67  |     // Clear search
  68  |     await page.getByPlaceholder('Search events...').fill('');
  69  |     await expect(page.getByText('No events found')).toBeHidden();
  70  |   });
  71  | 
  72  |   test('should test Toast notification lifecycle', async ({ page, isMobile }) => {
  73  |     test.skip(isMobile, 'Tabs navigation is hidden on mobile, and the test uses desktop tabs.');
  74  |     // Navigate to Analytics
  75  |     await page.getByRole('button', { name: 'Analytics', exact: true }).click();
  76  | 
  77  |     // Give some time to render
  78  |     await page.waitForLoadState('networkidle');
  79  | 
  80  |     // Click Copy Link
  81  |     await page.locator('button[title="Copy Link"]').click();
  82  | 
  83  |     // Verify Toast is shown
  84  |     const toast = page.getByRole('alert');
  85  |     await expect(toast).toBeVisible();
  86  |     await expect(page.getByText('Link Copied!')).toBeVisible();
  87  | 
  88  |     // Wait for Toast to disappear automatically or close it manually
  89  |     await page.locator('button[aria-label="Close notification"]').click();
  90  |     await expect(toast).toBeHidden();
  91  |   });
  92  | 
  93  |   test('should recover via Error Boundary when corrupted data is injected', async ({ page }) => {
  94  |     // Inject corrupted data into LocalStorage
  95  |     await page.evaluate(() => {
  96  |       localStorage.setItem('chronicle_events_data_v1', JSON.stringify([
  97  |         { id: 'corrupted-event', status: 'live' }
  98  |       ]));
  99  |     });
  100 | 
  101 |     // Reload page to trigger state initialization with corrupted data
  102 |     await page.reload();
  103 | 
  104 |     // The app should crash when filtering/rendering because title is undefined
  105 |     // Error Boundary should catch it (Wait for either Vite overlay or our Error Boundary)
> 106 |     await expect(page.locator('text=Something went wrong').or(page.locator('vite-error-overlay'))).toBeAttached();
      |                                                                                                    ^ Error: expect(locator).toBeAttached() failed
  107 | 
  108 |     // Test recovery button
  109 |     // But since the local storage is still corrupted, reloading will just crash again.
  110 |     // Let's clear it before clicking reload
  111 |     await page.evaluate(() => {
  112 |       localStorage.removeItem('chronicle_events_data_v1');
  113 |     });
  114 | 
  115 |     // Instead of clicking Reload Page which might be under overlay, just reload page manually
  116 |     await page.reload();
  117 | 
  118 |     // Should load cleanly now
  119 |     await expect(page.getByText('Your Events')).toBeVisible();
  120 |   });
  121 | 
  122 | });
  123 | 
```