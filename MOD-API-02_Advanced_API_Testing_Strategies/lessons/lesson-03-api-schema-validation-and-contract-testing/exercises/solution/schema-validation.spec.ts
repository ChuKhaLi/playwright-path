import { test, expect } from '@playwright/test';
import { userSchema } from './schemas';

test('should validate the user API response against the Zod schema', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  expect(response.ok()).toBe(true);

  const user = await response.json();

  // Validate the user data against the schema
  // This will throw an error if the validation fails
  const validationResult = userSchema.safeParse(user);

  // Assert that the validation was successful
  expect(validationResult.success).toBe(true);

  // You can also do this, which is more direct for testing
  // If it doesn't throw, the test passes this line.
  userSchema.parse(user);
  
  // Optional: A final assertion to make the test's success explicit
  expect(true).toBe(true);
});