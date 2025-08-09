import { test, expect } from '@playwright/test';

// Helper function for a simple delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('should poll for status until a task is completed', async ({ page }) => {
  const taskId = 'task-123';
  let pollCount = 0;

  // Mock the initial request to start the task
  await page.route('**/api/process-video', async (route) => {
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ taskId }),
    });
  });

  // Mock the status endpoint with stateful behavior
  await page.route(`**/api/process-video/status/${taskId}`, async (route) => {
    pollCount++;
    let status = 'PROCESSING';
    if (pollCount >= 3) {
      status = 'COMPLETED';
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ taskId, status }),
    });
  });

  // 1. Start the process
  const startResponse = await page.request.post('/api/process-video', { data: { videoId: 'vid-001' } });
  const startBody = await startResponse.json();
  expect(startResponse.status()).toBe(202);
  expect(startBody.taskId).toBe(taskId);

  // 2. Poll for completion
  let finalStatus = '';
  const maxPolls = 5;
  for (let i = 0; i < maxPolls; i++) {
    console.log(`Polling attempt #${i + 1}...`);
    const statusResponse = await page.request.get(`/api/process-video/status/${taskId}`);
    const statusBody = await statusResponse.json();
    
    if (statusBody.status === 'COMPLETED') {
      finalStatus = statusBody.status;
      console.log('Task completed!');
      break;
    }
    
    await delay(500); // Wait before the next poll
  }

  // 3. Assert the final status
  expect(finalStatus).toBe('COMPLETED');
});