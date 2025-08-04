# Lesson 8: Cross-Origin and Iframe Testing

## Lesson Overview

This lesson tackles the complexities of testing web applications that embed content from different origins using iframes. You will learn how to effectively locate and interact with elements inside iframes, a common scenario in applications that integrate third-party services like payment gateways, maps, or support chats.

## Learning Objectives

By the end of this lesson, you will be able to:

-   Understand the concept of a browser "origin" and the Same-Origin Policy.
-   Identify when content is loaded within an iframe.
-   Use Playwright's `frame` and `frameLocator` methods to target and interact with iframes.
-   Write stable tests that can handle dynamically loaded iframes.
-   Manage interactions that span across the main page and an embedded iframe.