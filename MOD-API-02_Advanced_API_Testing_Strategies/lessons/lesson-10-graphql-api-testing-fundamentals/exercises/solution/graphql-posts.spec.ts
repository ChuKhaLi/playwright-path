import { test, expect } from '@playwright/test';

const API_URL = 'https://graphqlzero.almansi.me/api';

test.describe('GraphQL Posts API', () => {
  test('should fetch a single post by ID', async ({ request }) => {
    const query = `
      query ($id: ID!) {
        post(id: $id) {
          id
          title
          body
        }
      }
    `;

    const variables = { id: 1 };

    const response = await request.post(API_URL, {
      data: { query, variables },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();

    const post = body.data.post;
    expect(post.id).toBe('1'); // Note: The API returns ID as a string
    expect(post.title).toBeDefined();
    expect(post.body).toBeDefined();
  });

  test('should create a new post using a mutation', async ({ request }) => {
    const mutation = `
      mutation ($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          body
        }
      }
    `;

    const variables = {
      input: {
        title: 'A New Post by Roo',
        body: 'This is the content of the post.',
      },
    };

    const response = await request.post(API_URL, {
      data: { query: mutation, variables },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();

    const newPost = body.data.createPost;
    expect(newPost.id).toBeDefined();
    expect(newPost.title).toBe(variables.input.title);
    expect(newPost.body).toBe(variables.input.body);
  });
});