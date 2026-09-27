import { test, expect } from '@playwright/test';

test.describe('Event Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the organizer dashboard and open the Create Event flow
    await page.goto('/');
    
    // Check if we need to click "Create Event" or if we can navigate directly
    // Assuming there's a button to create event
    const createBtn = page.getByRole('button', { name: /create event|new event/i });
    if (await createBtn.isVisible()) {
      await createBtn.click();
    }
  });

  test('should complete the happy path for creating an event', async ({ page }) => {
    // Step 1: Core Metadata
    await expect(page.getByText('Step 1 of 4: Core Metadata')).toBeVisible();
    await page.getByPlaceholder('e.g. NextGen Engineering Con 2026').fill('Playwright Test Event');
    await page.getByPlaceholder('e.g. Acme AI').fill('Playwright Organizer');
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 2: Visuals & Branding
    await expect(page.getByText('Step 2 of 4: Visuals & Branding')).toBeVisible();
    await page.getByPlaceholder('https://linkedin.com/company/...').fill('https://linkedin.com/company/test');
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 3: Attendee Prompts
    await expect(page.getByText('Step 3 of 4: Attendee Prompts')).toBeVisible();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Step 4: Final Verification
    await expect(page.getByText('Step 4 of 4: Final Verification')).toBeVisible();
    await page.getByRole('button', { name: /Publish Event/i }).click();

    // Step 5: Success
    await expect(page.getByText('Your event is live')).toBeVisible();
  });

  test('should validate empty and whitespace-only title and organizer', async ({ page }) => {
    // Step 1: Core Metadata
    await page.getByPlaceholder('e.g. NextGen Engineering Con 2026').fill('   ');
    await page.getByPlaceholder('e.g. Acme AI').fill('   ');
    
    // We expect window.alert to be called
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.getByRole('button', { name: /Save Draft/i }).click();
    expect(alertMessage).toContain('Event Title and Organizer are required.');
  });

  test('should handle massive descriptions properly (boundary conditions)', async ({ page }) => {
    const massiveText = 'A'.repeat(600);
    const textarea = page.locator('textarea');
    await textarea.fill(massiveText);
    
    // If maxLength is enforced, the value length should be 500
    const val = await textarea.inputValue();
    expect(val.length).toBeLessThanOrEqual(500);
  });

  test('should handle special characters in organizer names', async ({ page }) => {
    const specialChars = 'Acme Corp 🔥 @#%&*()_+';
    await page.getByPlaceholder('e.g. Acme AI').fill(specialChars);
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByText('Step 2 of 4: Visuals & Branding')).toBeVisible();
  });

  test('should validate invalid URLs', async ({ page }) => {
    await page.getByRole('button', { name: /Continue/i }).click();
    
    // Step 2
    await page.getByPlaceholder('https://linkedin.com/company/...').fill('javascript:alert(1)');
    
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.getByRole('button', { name: /Save Draft/i }).click();
    expect(alertMessage).toContain('valid HTTP/HTTPS URLs');
  });

  test('should handle adding 50 hashtags (boundary conditions)', async ({ page }) => {
    let alertCount = 0;
    page.on('dialog', dialog => {
      if (dialog.message().includes('Maximum of 15 hashtags allowed')) {
        alertCount++;
      }
      dialog.accept();
    });

    const tagInput = page.getByPlaceholder('+ Add tag...');
    // We already have 4 tags by default in the initial state
    // We will add 15 more, which should trigger the limit
    for (let i = 0; i < 15; i++) {
      await tagInput.fill(`tag${i}`);
      await tagInput.press('Enter');
    }
    
    // The maximum should be 15 tags total
    // So the 12th new tag (since 4 exist) should trigger the alert
    expect(alertCount).toBeGreaterThan(0);
    
    // Verify tag 14 was NOT added
    await expect(page.locator('span', { hasText: '#tag14' })).not.toBeVisible();
  });

  test('should prevent issues on double clicking Publish', async ({ page }) => {
    // Quick progression to step 4
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /Continue/i }).click();

    // Now on step 4
    const publishBtn = page.getByRole('button', { name: /Publish Event/i });
    
    // Double click Publish
    await publishBtn.click();
    await publishBtn.click({ force: true }); // Trying to click even if disabled/unmounted

    // Ensure we reached success screen
    await expect(page.getByText('Your event is live')).toBeVisible();
  });
});
