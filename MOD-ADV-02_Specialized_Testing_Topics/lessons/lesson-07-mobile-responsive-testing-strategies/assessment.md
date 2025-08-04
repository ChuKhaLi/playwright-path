# Lesson 7: Assessment

## Knowledge Check

Test your understanding of mobile and responsive testing strategies.

### Question 1

What is the primary mechanism Playwright uses to simulate mobile devices?

a) By resizing the browser window manually.
b) By using pre-configured device descriptors from its `devices` collection.
c) By installing a separate mobile browser.
d) By using a physical device farm.

**Answer:** b) By using pre-configured device descriptors from its `devices` collection.

### Question 2

How should you structure your tests to run against both desktop and mobile viewports?

a) Write two separate test files, one for desktop and one for mobile.
b) Use an `if` statement in your test to check the browser name.
c) Create different projects in `playwright.config.ts` for each device you want to test.
d) You can only test one viewport at a time.

**Answer:** c) Create different projects in `playwright.config.ts` for each device you want to test.

### Question 3

What is the purpose of the `isMobile` fixture in Playwright?

a) It indicates if the test is running on a real mobile device.
b) It is a boolean that is `true` if the test is running under a project configuration that is considered mobile.
c) It is a function that converts a desktop site to a mobile site.
d) It is used to enable touch events.

**Answer:** b) It is a boolean that is `true` if the test is running under a project configuration that is considered mobile.

### Question 4

When performing visual regression testing on a responsive site, how does Playwright manage the baseline screenshots for different devices?

a) It uses the same baseline for all devices and expects them to match.
b) It automatically appends the project name to the screenshot filename, creating separate baselines for each device.
c) You have to manually create and name different screenshots for each device.
d) It does not support visual testing on mobile devices.

**Answer:** b) It automatically appends the project name to the screenshot filename, creating separate baselines for each device.

### Question 5

Why is it important to test for responsive design?

a) To make the website look good on large monitors.
b) Because a large percentage of users browse on mobile devices, and it impacts user experience and SEO.
c) To ensure the website loads quickly.
d) To meet government regulations.

**Answer:** b) Because a large percentage of users browse on mobile devices, and it impacts user experience and SEO.