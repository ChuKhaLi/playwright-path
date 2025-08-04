# Assessment: Testing Real-time Applications (WebSockets)

## Knowledge Check

### Question 1
What is the main difference between HTTP and WebSocket communication?
a) WebSockets are slower than HTTP.
b) HTTP is a persistent, bidirectional connection, while WebSockets use a request-response model.
c) WebSockets allow for a persistent, bidirectional connection, while HTTP uses a request-response model.
d) WebSockets can only transmit text data.

**Answer:** c) WebSockets allow for a persistent, bidirectional connection, while HTTP uses a request-response model.

---

### Question 2
Which Playwright event should you listen for to capture incoming WebSocket messages?
a) `websocket`
b) `framereceived`
c) `framesent`
d) `messagereceived`

**Answer:** b) `framereceived`

---

### Question 3
What is generally the most robust way to test a real-time UI update?
a) By asserting on the content of the WebSocket message and then checking the UI.
b) By adding a fixed `page.waitForTimeout()` to wait for the UI to update.
c) By triggering the event and then using a web-first assertion like `expect(locator).toBeVisible()` to check the UI change.
d) By reloading the page to see if the change is there.

**Answer:** c) By triggering the event and then using a web-first assertion like `expect(locator).toBeVisible()` to check the UI change.

---

### Question 4
When should you start listening for a `'websocket'` event in your test?
a) After the page has fully loaded.
b) After the WebSocket connection has already been made.
c) Before navigating to the page or performing the action that initiates the WebSocket connection.
d) It does not matter when you start listening.

**Answer:** c) Before navigating to the page or performing the action that initiates the WebSocket connection.

---

## Practical Application

### Scenario
You are testing a live stock ticker application. When the page loads, it establishes a WebSocket connection to a server. The server then pushes stock price updates every few seconds. The UI should update to reflect the latest price.

### Task
Write a Playwright test script that performs the following actions:
1.  **Listen for Connection:**
    -   Start listening for the `'websocket'` event before navigating.
    -   Navigate to the stock ticker application.
    -   Await the `websocket` promise and assert that a WebSocket connection was made.
2.  **Listen for Messages:**
    -   Attach a listener to the `framereceived` event on the WebSocket object.
    -   The listener should parse the incoming JSON message and check if it contains a `price` for the stock "PW".
3.  **Test UI Update:**
    -   The application starts with the price of "PW" at "$100.00".
    -   The server will send a WebSocket message: `{"stock": "PW", "price": 105.50}`.
    -   Use `expect.poll` or a web-first assertion to wait for the price display for "PW" on the page to update to "$105.50".
    -   Assert that the text content of the price element is indeed "$105.50".

Provide the complete TypeScript code for this test.