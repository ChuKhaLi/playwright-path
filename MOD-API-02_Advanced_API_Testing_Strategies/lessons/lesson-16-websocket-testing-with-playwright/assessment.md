# Lesson 16 Assessment: WebSocket Testing

**Question 1:** What is the primary Playwright event you should listen for to capture a new WebSocket connection?

- A) `page.on('request')`
- B) `page.on('websocket')`
- C) `page.on('response')`
- D) `page.on('load')`

**Question 2:** Which method on the `WebSocket` object is used to wait for a message from the server?

- A) `waitForEvent('framereceived')`
- B) `waitForEvent('framesent')`
- C) `waitForMessage()`
- D) `listen()`

**Question 3:** True or False: `page.route()` can be used to directly mock WebSocket messages in the same way it mocks HTTP requests.

- A) True
- B) False

---
*Scroll down for answers.*
---
> **Answers**
> 1. B) `page.on('websocket')`
> 2. A) `waitForEvent('framereceived')`
> 3. B) False