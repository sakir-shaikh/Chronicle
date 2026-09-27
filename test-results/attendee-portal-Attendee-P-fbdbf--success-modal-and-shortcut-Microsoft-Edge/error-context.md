# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: attendee-portal.spec.ts >> Attendee Portal - Exhaustive Tests >> Copy to clipboard success modal and shortcut
- Location: tests\e2e\attendee-portal.spec.ts:163:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "https://www.linkedin.com/feed/?shareActive=true"
Received: "https://www.linkedin.com/login/?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F%3FshareActive%3Dtrue"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    6 × locator resolved to <html lang="en" dir="ltr" translate="no">…</html>
      - unexpected value "https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F%3FshareActive%3Dtrue"
    3 × locator resolved to <html lang="en" dir="ltr" translate="no">…</html>
      - unexpected value "https://www.linkedin.com/login/?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F%3FshareActive%3Dtrue"

```

```yaml
- heading "0 notifications" [level=2]
- main:
  - link "LinkedIn":
    - /url: /
    - img "LinkedIn"
  - heading "Sign in" [level=1]
  - paragraph: New to LinkedIn?
  - link "Join now":
    - /url: /signup/cold-join/?fromLogin=true
  - button "Sign in with Google Button":
    - iframe
  - button "Sign in with Microsoft"
  - button "Sign in with Apple"
  - paragraph:
    - text: By continuing, you agree to LinkedIn’s
    - link "User Agreement":
      - /url: https://www.linkedin.com/legal/user-agreement/
      - strong: User Agreement
    - text: ","
    - link "Privacy Policy":
      - /url: https://www.linkedin.com/legal/privacy-policy/
      - strong: Privacy Policy
    - text: ", and"
    - link "Cookie Policy":
      - /url: https://www.linkedin.com/legal/cookie-policy/
      - strong: Cookie Policy
    - text: .
  - paragraph: or
  - text: Email or phone
  - textbox "Email or phone"
  - text: Password
  - textbox "Password"
  - button "Show password"
  - link "Forgot password?":
    - /url: /passwordReset/?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F%3FshareActive%3Dtrue
  - checkbox "Keep me signed in" [checked]:
    - checkbox [checked]
    - paragraph: Keep me signed in
  - button "Sign in"
  - paragraph: LinkedIn Corporation © 2026
  - link "User Agreement":
    - /url: https://www.linkedin.com/legal/user-agreement/
    - paragraph: User Agreement
  - link "Privacy Policy":
    - /url: https://www.linkedin.com/legal/privacy-policy/
    - paragraph: Privacy Policy
  - link "Community Guidelines":
    - /url: https://www.linkedin.com/help/linkedin/answer/a403269/
    - paragraph: Community Guidelines
  - link "Cookie Policy":
    - /url: https://www.linkedin.com/legal/cookie-policy/
    - paragraph: Cookie Policy
  - link "Copyright Policy":
    - /url: https://www.linkedin.com/legal/copyright-policy/
    - paragraph: Copyright Policy
  - link "Send Feedback":
    - /url: https://www.linkedin.com/help/linkedin/
    - paragraph: Send Feedback
  - button "Language":
    - paragraph: Language
```

# Test source

```ts
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
  111 | 
  112 |   test('Concurrent actions and Refine with AI disabled state', async ({ page }) => {
  113 |     const generateBtn = page.getByRole('button', { name: 'Generate LinkedIn Post' });
  114 |     const refineBtn = page.getByRole('button', { name: 'Regenerate (Different Tone)' });
  115 |     
  116 |     await generateBtn.click();
  117 |     
  118 |     // While generating, Refine buttons should be disabled (assuming we fix the bug)
  119 |     await expect(generateBtn).toBeDisabled();
  120 |     await expect(refineBtn).toBeDisabled();
  121 |     
  122 |     // Wait for completion
  123 |     await expect(generateBtn).toBeEnabled();
  124 |     await expect(refineBtn).toBeEnabled();
  125 |   });
  126 | 
  127 |   test('Regeneration creates new versions and allows switching', async ({ page }) => {
  128 |     const generateBtn = page.getByRole('button', { name: 'Generate LinkedIn Post' });
  129 |     
  130 |     // It already has Version 1 on mount
  131 |     await expect(page.getByText('Draft 1 of 1')).toBeHidden(); // Only shows if > 1
  132 |     
  133 |     // Generate version 2
  134 |     await page.getByRole('button', { name: 'Grateful Attendee' }).click();
  135 |     await generateBtn.click();
  136 |     await expect(generateBtn).toBeEnabled();
  137 |     
  138 |     await expect(page.getByText('Draft 2 of 2')).toBeVisible();
  139 |     
  140 |     // Switch to version 1
  141 |     await page.getByRole('button', { name: '1', exact: true }).click();
  142 |     // It shouldn't crash, the text should change.
  143 |     
  144 |     // Generate version 3 using refine
  145 |     await page.getByRole('button', { name: 'Make Shorter' }).click();
  146 |     await expect(generateBtn).toBeEnabled();
  147 |     await expect(page.getByText('Draft 3 of 3')).toBeVisible();
  148 |   });
  149 | 
  150 |   test('Editing the post and saving', async ({ page }) => {
  151 |     // Click Edit Post
  152 |     await page.getByTitle('Edit Post Text').click();
  153 |     
  154 |     const editor = page.locator('textarea').nth(1); // the post editor
  155 |     await editor.fill('This is a manually edited post.');
  156 |     
  157 |     await page.getByRole('button', { name: 'Save Changes' }).click();
  158 |     
  159 |     const postPreview = page.locator('.whitespace-pre-line');
  160 |     await expect(postPreview).toContainText('This is a manually edited post.');
  161 |   });
  162 | 
  163 |   test('Copy to clipboard success modal and shortcut', async ({ page }) => {
  164 |     // Setup clipboard permissions for the browser
  165 |     // Done automatically in some playwright environments, but we can verify UI states
  166 |     
  167 |     await page.getByRole('button', { name: 'Copy Post' }).click();
  168 |     
  169 |     // Check alert banner
  170 |     await expect(page.getByText('Post copied! Ready to paste directly into LinkedIn.')).toBeVisible();
  171 |     
  172 |     // Open in LinkedIn should show modal
  173 |     const popupPromise = page.waitForEvent('popup');
  174 |     await page.getByRole('button', { name: 'Open in LinkedIn' }).click();
  175 |     const popup = await popupPromise;
> 176 |     await expect(popup).toHaveURL('https://www.linkedin.com/feed/?shareActive=true');
      |                         ^ Error: expect(page).toHaveURL(expected) failed
  177 |     
  178 |     // Modal should be visible
  179 |     await expect(page.getByText('Your post is ready to share!')).toBeVisible();
  180 |     
  181 |     // Close modal
  182 |     await page.getByRole('button', { name: 'Done' }).click();
  183 |     await expect(page.getByText('Your post is ready to share!')).toBeHidden();
  184 |   });
  185 | });
  186 | 
```