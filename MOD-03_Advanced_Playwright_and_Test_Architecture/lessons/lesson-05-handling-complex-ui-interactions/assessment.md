# Lesson 5: Assessment - Handling Complex UI Interactions

This assessment will test your ability to handle complex UI interactions in Playwright.

## Questions

### Question 1:
**How do you interact with an element located inside an iframe with the ID `#my-frame`?**
a) `page.locator('#my-frame').locator('button').click()`
b) `page.frameLocator('#my-frame').getByRole('button').click()`
c) `page.switchToFrame('#my-frame'); page.getByRole('button').click()`
d) `page.locator('iframe#my-frame button').click()`

**Answer:**
b) `page.frameLocator('#my-frame').getByRole('button').click()`. `frameLocator()` is the correct Playwright method to get a locator for the iframe, which you then use to find elements within it.

---

### Question 2:
**You need to test a file upload. Which Playwright method should you use to select the file to be uploaded?**
a) `locator.uploadFile('path/to/file.pdf')`
b) `page.upload('path/to/file.pdf')`
c) `locator.setInputFiles('path/to/file.pdf')`
d) `page.on('filechooser', ...)`

**Answer:**
c) `locator.setInputFiles('path/to/file.pdf')`. This is the most direct and recommended way to set the file(s) for an input element of type "file".

---

### Question 3:
**What is the correct way to wait for a file download to complete after clicking a download link?**
a) `await page.waitForTimeout(5000);`
b) `const download = await page.waitForEvent('download');`
c) `await expect(page.locator('.download-complete-popup')).toBeVisible();`
d) `await page.waitForResponse('**/download');`

**Answer:**
b) `const download = await page.waitForEvent('download');`. It's crucial to start waiting for the `download` event *before* the action that triggers it.

---

### Question 4:
**A dropdown menu appears only when you move your mouse over a "Profile" button. How do you click the "Edit Profile" link inside that menu?**
a) `await page.getByRole('button', { name: 'Profile' }).click(); await page.getByRole('link', { name: 'Edit Profile' }).click();`
b) `await page.getByRole('button', { name: 'Profile' }).hover(); await page.getByRole('link', { name: 'Edit Profile' }).click();`
c) `await page.getByRole('link', { name: 'Edit Profile' }).click({ force: true });`
d) `await page.mouse.move(100, 200); await page.getByRole('link', { name: 'Edit Profile' }).click();`

**Answer:**
b) `await page.getByRole('button', { name: 'Profile' }).hover(); await page.getByRole('link', { name: 'Edit Profile' }).click();`. The `hover()` action is necessary to make the menu visible before you can interact with the link inside it.