import { test, expect } from './api-helper';

test('should fetch a single post', async ({ api }) => {
  const response = await api.get('/posts/1');
  
  expect(response.ok()).toBe(true);
  
  const post = await response.json();
  
  expect(post.id).toBe(1);
  expect(post.userId).toBe(1);
  expect(post.title).toBeDefined();
});