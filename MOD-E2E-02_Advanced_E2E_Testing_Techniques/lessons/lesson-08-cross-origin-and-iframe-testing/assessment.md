# Assessment: Cross-Origin and Iframe Testing

## Knowledge Check

### Question 1
What is the primary purpose of the browser's Same-Origin Policy?
a) To ensure all websites have the same look and feel.
b) To restrict how a script from one origin can interact with a resource from another origin for security reasons.
c) To make sure all iframes load from the same server.
d) To block all iframes from being used.

**Answer:** b) To restrict how a script from one origin can interact with a resource from another origin for security reasons.

---

### Question 2
What is the recommended Playwright method for locating elements within an iframe?
a) `page.locator()`
b) `page.frameLocator()`
c) `page.within()`
d) `page.frame().find()`

**Answer:** b) `page.frameLocator()`

---

### Question 3
If an iframe does not have a stable CSS selector, how else might you locate it using `page.frame()`?
a) By its visual position on the page.
b) By its content.
c) By its `name` attribute or its `url`.
d) You can only locate iframes with CSS selectors.

**Answer:** c) By its `name` attribute or its `url`.

---

### Question 4
When testing a feature that uses a third-party iframe (like a payment gateway), what is often a better strategy than directly testing the third-party's UI?
a) Ignoring the feature completely as it cannot be tested.
b) Mocking the API calls related to the iframe's service to test how your application handles success or failure.
c) Taking screenshots and manually verifying them.
d) Asking the third party to provide their own test scripts.

**Answer:** b) Mocking the API calls related to the iframe's service to test how your application handles success or failure.

---

## Practical Application

### Scenario
You are testing a blog page that embeds a "Comments" section from a third-party service inside an iframe. The iframe has an `id` of `comments-frame`. Inside the iframe, there is a `textarea` with a placeholder "Write your comment" and a "Post Comment" button.

### Task
Write a Playwright test script that performs the following actions:
1.  Navigates to the blog post page.
2.  Locates the iframe using `page.frameLocator()`.
3.  Within the iframe, finds the `textarea` and fills it with the text "This is a great post!".
4.  Within the iframe, clicks the "Post Comment" button.
5.  After clicking the button, a success message with the text "Comment posted successfully!" appears *inside the iframe*. Assert that this message is visible.

Provide the complete TypeScript code for this test.