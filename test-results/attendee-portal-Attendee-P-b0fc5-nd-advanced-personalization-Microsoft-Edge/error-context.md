# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: attendee-portal.spec.ts >> Attendee Portal - Exhaustive Tests >> Selecting tones and advanced personalization
- Location: tests\e2e\attendee-portal.spec.ts:87:3

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Attendees' })
    - locator resolved to <button class="transition-colors py-1 text-[#68766F] hover:text-[#20302A]">Attendees</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Attendee Portal - Exhaustive Tests', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate to the app
  6   |     await page.goto('/');
  7   |     
  8   |     // Go to Attendee view via Header Nav (assuming "Attendees" text or similar exists)
  9   |     // Looking at Header.tsx, we can probably click the "Attendees" nav item.
> 10  |     await page.getByRole('button', { name: 'Attendees' }).click();
      |                                                           ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  11  |     
  12  |     // Wait for the portal to load
  13  |     await expect(page.getByText('Official Attendee Portal')).toBeVisible();
  14  |   });
  15  | 
  16  |   test('Validates initial rendering and layout', async ({ page }) => {
  17  |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  18  |     await expect(page.getByText('Uploaded Photos')).toBeVisible();
  19  |     await expect(page.getByLabel('What stood out to you today?')).toBeVisible();
  20  |   });
  21  | 
  22  |   test('Adding and removing photos limits to 6', async ({ page }) => {
  23  |     // Initial photos should be 2
  24  |     await expect(page.getByText('2 / 6 attached')).toBeVisible();
  25  | 
  26  |     // Click Add Photo
  27  |     await page.getByRole('button', { name: '+ Add Photo' }).click();
  28  |     
  29  |     // Click on a sample photo 4 times to reach 6
  30  |     const samplePhotos = page.locator('.grid-cols-4 button');
  31  |     await expect(samplePhotos).toHaveCount(4);
  32  |     
  33  |     // Add 4 photos
  34  |     await samplePhotos.nth(0).click();
  35  |     await page.getByRole('button', { name: '+ Add Photo' }).click();
  36  |     await samplePhotos.nth(1).click();
  37  |     await page.getByRole('button', { name: '+ Add Photo' }).click();
  38  |     await samplePhotos.nth(2).click();
  39  |     await page.getByRole('button', { name: '+ Add Photo' }).click();
  40  |     await samplePhotos.nth(3).click();
  41  |     
  42  |     // Now it should be 6/6
  43  |     await expect(page.getByText('6 / 6 attached')).toBeVisible();
  44  |     
  45  |     // Add Photo button should disappear
  46  |     await expect(page.getByRole('button', { name: '+ Add Photo' })).toBeHidden();
  47  |     
  48  |     // Remove one photo
  49  |     const removeButtons = page.getByTitle('Remove Photo');
  50  |     await removeButtons.nth(0).click();
  51  |     
  52  |     await expect(page.getByText('5 / 6 attached')).toBeVisible();
  53  |     await expect(page.getByRole('button', { name: '+ Add Photo' })).toBeVisible();
  54  |   });
  55  | 
  56  |   test('Takeaway validation: empty, emojis, bypass limit', async ({ page }) => {
  57  |     const takeawaysInput = page.getByLabel('What stood out to you today?');
  58  |     
  59  |     // Test empty
  60  |     await takeawaysInput.fill('');
  61  |     await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
  62  |     
  63  |     // Should use fallback text in generation
  64  |     await expect(page.getByText('Analyzing your highlights...')).toBeVisible();
  65  |     // Wait for generation to finish
  66  |     await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
  67  |     
  68  |     // Content should contain the fallback
  69  |     const postPreview = page.locator('.whitespace-pre-line');
  70  |     await expect(postPreview).toContainText('Attending inspiring keynotes on next-generation architectures');
  71  | 
  72  |     // Test emoji
  73  |     await takeawaysInput.fill('Loved the event! 🚀🔥💯');
  74  |     await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
  75  |     await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
  76  |     await expect(postPreview).toContainText('Loved the event!');
  77  | 
  78  |     // Test bypass limit via quick prompts
  79  |     await takeawaysInput.fill('a'.repeat(490));
  80  |     await page.getByRole('button', { name: '"The biggest thing I learned..."' }).click();
  81  |     const textCounter = page.locator('text=/\\d+ \\/ 500 chars/');
  82  |     const text = await textCounter.innerText();
  83  |     const length = parseInt(text.split(' /')[0]);
  84  |     expect(length).toBeLessThanOrEqual(500);
  85  |   });
  86  | 
  87  |   test('Selecting tones and advanced personalization', async ({ page }) => {
  88  |     // Tone
  89  |     await page.getByRole('button', { name: 'Grateful Attendee' }).click();
  90  |     
  91  |     // Advanced personalization
  92  |     await page.getByRole('button', { name: 'Advanced Personalization' }).click();
  93  |     
  94  |     const mentionsInput = page.getByPlaceholder('@SpeakerName, @Company');
  95  |     await mentionsInput.fill('@Satya Nadella');
  96  |     
  97  |     const personalNoteInput = page.getByPlaceholder('e.g. Loved reconnecting');
  98  |     await personalNoteInput.fill('Great seeing the MSFT team.');
  99  |     
  100 |     await page.getByRole('button', { name: 'concise', exact: true }).click();
  101 |     await page.getByRole('button', { name: 'natural', exact: true }).click();
  102 |     
  103 |     await page.getByRole('button', { name: 'Generate LinkedIn Post' }).click();
  104 |     
  105 |     await expect(page.getByRole('button', { name: 'Generate LinkedIn Post' })).toBeEnabled();
  106 |     
  107 |     const postPreview = page.locator('.whitespace-pre-line');
  108 |     await expect(postPreview).toContainText('@Satya Nadella');
  109 |     await expect(postPreview).toContainText('Great seeing the MSFT team.');
  110 |   });
```