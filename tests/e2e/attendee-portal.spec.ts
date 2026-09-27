import { test, expect } from '@playwright/test';

test.describe('Attendee Portal - Exhaustive Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Go to Attendee view via Header Nav (assuming "Attendees" text or similar exists)
    // Looking at Header.tsx, we can probably click the "Attendees" nav item.
    await page.getByRole('button', { name: 'Attendees' }).click();
    
    // Wait for the portal to load
    await expect(page.getByText('Official Attendee Portal')).toBeVisible();
  });

  test('Validates initial rendering and layout', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Uploaded Photos')).toBeVisible();
    await expect(page.getByLabel('What stood out to you today?')).toBeVisible();
  });

  test('Adding and removing photos limits to 6', async ({ page }) => {
    // Initial photos should be 2
    await expect(page.getByText('2 / 6 attached')).toBeVisible();

    // Click Add Photo
    await page.getByRole('button', { name: '+ Add Photo' }).click();
    
    // Click on a sample photo 4 times to reach 6
    const samplePhotos = page.locator('.grid-cols-4 button');
    await expect(samplePhotos).toHaveCount(4);
    
    // Add 4 photos
    await samplePhotos.nth(0).click();
    await page.getByRole('button', { name: '+ Add Photo' }).click();
    await samplePhotos.nth(1).click();
    await page.getByRole('button', { name: '+ Add Photo' }).click();
    await samplePhotos.nth(2).click();
    await page.getByRole('button', { name: '+ Add Photo' }).click();
    await samplePhotos.nth(3).click();
    
    // Now it should be 6/6
    await expect(page.getByText('6 / 6 attached')).toBeVisible();
    
    // Add Photo button should disappear
    await expect(page.getByRole('button', { name: '+ Add Photo' })).toBeHidden();
    
    // Remove one photo
    const removeButtons = page.getByTitle('Remove Photo');
    await removeButtons.nth(0).click();
    
    await expect(page.getByText('5 / 6 attached')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add Photo' })).toBeVisible();
  });

  test('Takeaway validation: empty, emojis, bypass limit', async ({ page }) => {
    const takeawaysInput = page.getByLabel('What stood out to you today?');
    
    // Test empty
    await takeawaysInput.fill('');
    await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
    
    // Should use fallback text in generation
    await expect(page.getByText('Analyzing your highlights...')).toBeVisible();
    // Wait for generation to finish
    await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
    
    // Content should contain the fallback
    const postPreview = page.locator('.whitespace-pre-line');
    await expect(postPreview).toContainText('Attending inspiring keynotes on next-generation architectures');

    // Test emoji
    await takeawaysInput.fill('Loved the event! 🚀🔥💯');
    await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
    await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
    await expect(postPreview).toContainText('Loved the event!');

    // Test bypass limit via quick prompts
    await takeawaysInput.fill('a'.repeat(490));
    await page.getByRole('button', { name: '"The biggest thing I learned..."' }).click();
    const textCounter = page.locator('text=/\\d+ \\/ 500 chars/');
    const text = await textCounter.innerText();
    const length = parseInt(text.split(' /')[0]);
    expect(length).toBeLessThanOrEqual(500);
  });

  test('Selecting tones and advanced personalization', async ({ page }) => {
    // Tone
    await page.getByRole('button', { name: 'Grateful Attendee' }).click();
    
    // Advanced personalization
    await page.getByRole('button', { name: 'Advanced Personalization' }).click();
    
    const mentionsInput = page.getByPlaceholder('@SpeakerName, @Company');
    await mentionsInput.fill('@Satya Nadella');
    
    const personalNoteInput = page.getByPlaceholder('e.g. Loved reconnecting');
    await personalNoteInput.fill('Great seeing the MSFT team.');
    
    await page.getByRole('button', { name: 'concise', exact: true }).click();
    await page.getByRole('button', { name: 'natural', exact: true }).click();
    
    await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
    
    await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
    
    const postPreview = page.locator('.whitespace-pre-line');
    await expect(postPreview).toContainText('@Satya Nadella');
    await expect(postPreview).toContainText('Great seeing the MSFT team.');
  });

  test('Concurrent actions and Refine with AI disabled state', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: 'Generate LinkedIn Post' });
    const refineBtn = page.getByRole('button', { name: 'Regenerate (Different Tone)' });
    
    await generateBtn.click();
    
    // While generating, Refine buttons should be disabled (assuming we fix the bug)
    await expect(generateBtn).toBeDisabled();
    await expect(refineBtn).toBeDisabled();
    
    // Wait for completion
    await expect(generateBtn).toBeEnabled();
    await expect(refineBtn).toBeEnabled();
  });

  test('Regeneration creates new versions and allows switching', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: 'Generate LinkedIn Post' });
    
    // It already has Version 1 on mount
    await expect(page.getByText('Draft 1 of 1')).toBeHidden(); // Only shows if > 1
    
    // Generate version 2
    await page.getByRole('button', { name: 'Grateful Attendee' }).click();
    await generateBtn.click();
    await expect(generateBtn).toBeEnabled();
    
    await expect(page.getByText('Draft 2 of 2')).toBeVisible();
    
    // Switch to version 1
    await page.getByRole('button', { name: '1', exact: true }).click();
    // It shouldn't crash, the text should change.
    
    // Generate version 3 using refine
    await page.getByRole('button', { name: 'Make Shorter' }).click();
    await expect(generateBtn).toBeEnabled();
    await expect(page.getByText('Draft 3 of 3')).toBeVisible();
  });

  test('Editing the post and saving', async ({ page }) => {
    // Click Edit Post
    await page.getByTitle('Edit Post Text').click();
    
    const editor = page.locator('textarea').nth(1); // the post editor
    await editor.fill('This is a manually edited post.');
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    const postPreview = page.locator('.whitespace-pre-line');
    await expect(postPreview).toContainText('This is a manually edited post.');
  });

  test('Copy to clipboard success modal and shortcut', async ({ page }) => {
    // Setup clipboard permissions for the browser
    // Done automatically in some playwright environments, but we can verify UI states
    
    await page.getByRole('button', { name: 'Copy Post' }).click();
    
    // Check alert banner
    await expect(page.getByText('Post copied! Ready to paste directly into LinkedIn.')).toBeVisible();
    
    // Open in LinkedIn should show modal
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Open in LinkedIn' }).click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL('https://www.linkedin.com/feed/?shareActive=true');
    
    // Modal should be visible
    await expect(page.getByText('Your post is ready to share!')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByText('Your post is ready to share!')).toBeHidden();
  });
});
