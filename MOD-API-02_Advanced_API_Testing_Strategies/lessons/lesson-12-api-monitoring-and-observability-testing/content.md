# Lesson 12: API Monitoring and Observability Testing

## 1. From Testing to Observing

Traditional testing focuses on verifying known conditions in a controlled pre-production environment. But what about the "unknown unknowns"—the problems you didn't anticipate? This is where **observability** comes in.

-   **Monitoring:** Is the system up? Monitoring is about collecting predefined sets of metrics or logs to watch for known failure modes. You have dashboards that track CPU usage, error rates, etc.
-   **Observability:** Can I understand why the system is down? Observability is about instrumenting your application to emit detailed data (logs, metrics, traces) so that you can explore and understand its internal state from the outside, allowing you to debug novel problems.

As a QA engineer, your role is evolving to include **testing the instrumentation** itself. Is the application emitting the right data to make it observable?

## 2. The Three Pillars of Observability

Observability is built on three main types of telemetry data.

### a) Logs
Logs are timestamped records of events. Modern applications use **structured logs** (usually JSON), which are much more powerful than plain text because they can be easily searched, filtered, and aggregated.

**Example Structured Log:**
```json
{
  "timestamp": "2023-10-27T10:00:00Z",
  "level": "INFO",
  "message": "User logged in successfully",
  "userId": "user-123",
  "sourceIp": "192.168.1.100"
}
```

### b) Metrics
Metrics are numerical measurements aggregated over time. They are efficient to store and query, making them ideal for dashboards and alerting.
-   **Latency:** API response time (e.g., `api.response.time.p95`).
-   **Throughput:** Requests per second.
-   **Error Rate:** Percentage of 5xx or 4xx status codes.
-   **Resource Usage:** CPU and memory utilization.

### c) Traces (Distributed Tracing)
Traces are the most powerful tool for understanding microservices. A trace represents the full journey of a single request as it travels through multiple services. Each step in the journey is a **span**.

**Example Trace:**
A request to create an order might generate a trace like this:
-   `Span 1: POST /orders` (API Gateway)
    -   `Span 2: POST /orders` (Order Service)
        -   `Span 3: GET /products/123` (Product Service)
        -   `Span 4: POST /payments` (Payment Service)

This allows you to pinpoint exactly where a failure occurred or which service is causing a delay.

## 3. Testing the Instrumentation

If your logs, metrics, and traces are wrong, your ability to debug in production is compromised. Therefore, we must test them.

### Testing Structured Logs
**Strategy:**
1.  Run your API test.
2.  After the test, query your logging system (e.g., Elasticsearch, Splunk, Datadog) for logs related to that specific request (you can use a unique request ID for this).
3.  Assert that the logs were created and that the structured data is correct.

This often requires setting up a test-specific logging pipeline or having an API to query the logging system.

### Testing Metrics
**Strategy:**
1.  Query your monitoring system (e.g., Prometheus, Datadog) for the current value of a metric (e.g., `http_requests_total`).
2.  Run your API test that makes a request.
3.  Query the metric again and assert that its value has incremented as expected.

### Testing Distributed Traces
This is the most complex to test but also highly valuable.

**Strategy:**
1.  **Trace Propagation:** When you make a request, include a trace ID header (e.g., `traceparent`).
2.  After the request flows through all the services, query your tracing system (e.g., Jaeger, Zipkin, Honeycomb) for that specific trace ID.
3.  **Assert the Trace Structure:**
    -   Verify that the trace contains the expected number of spans.
    -   Check that the parent-child relationships between spans are correct (e.g., the `Order Service` span is the parent of the `Payment Service` span).
    -   Assert that important metadata (like `userId` or `orderId`) is attached to the spans as tags.

### Example: Validating Trace Propagation

Playwright can inject the necessary headers for you.

```typescript
import { test, expect } from '@playwright/test';

test('should propagate trace context through multiple services', async ({ request }) => {
  const traceId = `test-trace-${Date.now()}`;
  
  // Make a request to the first service in the chain
  const response = await request.post('/api/service-a', {
    headers: {
      // Standard W3C Trace Context header
      'traceparent': `00-${traceId}-0123456789abcdef0-01`,
    },
    data: { some: 'data' },
  });
  
  expect(response.ok()).toBe(true);

  // In a real test, you would now query your tracing backend.
  // For this example, we'll assume the response includes the trace ID for verification.
  const responseTraceId = response.headers()['x-trace-id'];
  expect(responseTraceId).toBe(traceId);

  // Now, you would use the API of your observability tool (e.g., Datadog, Jaeger)
  // to fetch the trace and assert its structure.
  // const trace = await myObservabilityTool.getTrace(traceId);
  // expect(trace.spans.length).toBe(3);
  // expect(trace).toHaveCorrectParentChildStructure();
});
```

## 4. Summary

-   **Observability** is about being able to ask arbitrary questions about your system in production, which requires high-quality telemetry (logs, metrics, traces).
-   As testers, we must **validate the instrumentation** itself. Don't just trust that the logs and traces are correct.
-   **Test structured logs:** Ensure the right events are logged with the correct, structured data.
-   **Test metrics:** Verify that counters increment and gauges are set correctly.
-   **Test distributed traces:** This is key for microservices. Ensure that trace context is propagated correctly and that traces have the right structure and metadata. This allows you to understand the complete lifecycle of a request.