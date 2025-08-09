import { test, expect } from '@playwright/test';

const API_URL = 'https://jsonplaceholder.typicode.com';

test('should fetch posts for the first user in the user list', async ({ request }) => {
  // Step 1: Fetch all users
  const usersResponse = await request.get(`${API_URL}/users`);
  expect(usersResponse.ok()).toBe(true);
  const users = await usersResponse.json();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);

  // Step 2: Get the first user's ID
  const firstUser = users[0];
  const userId = firstUser.id;
  console.log(`Testing with User ID: ${userId} (${firstUser.name})`);

  // Step 3: Fetch posts for that user
  const postsResponse = await request.get(`${API_URL}/posts`, {
    params: {
      userId: userId,
    },
  });
  expect(postsResponse.ok()).toBe(true);
  const posts = await postsResponse.json();
  expect(Array.isArray(posts)).toBe(true);
  expect(posts.length).toBeGreaterThan(0);

  // Step 4: Verify that all returned posts belong to the correct user
  for (const post of posts) {
    expect(post.userId).toBe(userId);
  }
  console.log(`Verified ${posts.length} posts for user ${userId}.`);
});