import { ApiClient } from '../src/api/api-client';
import { Post } from '../src/types';
import { DataFactory } from '../src/utils/data-factory';

describe('Posts API', () => {
  const apiClient = new ApiClient();

  it('should get all posts', async () => {
    const posts = await apiClient.get<Post[]>('/posts');
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should get a single post', async () => {
    const post = await apiClient.get<Post>('/posts/1');
    expect(post.id).toBe(1);
  });

  it('should create a new post', async () => {
    const newPostData = DataFactory.createPost({ title: 'My new post' });
    const post = await apiClient.post<Post>('/posts', newPostData);
    expect(post.title).toBe(newPostData.title);
    expect(post.body).toBe(newPostData.body);
    expect(post.userId).toBe(newPostData.userId);
  });

  it('should update a post', async () => {
    const updatedData = { title: 'updated title' };
    const post = await apiClient.put<Post>('/posts/1', updatedData);
    expect(post.title).toBe(updatedData.title);
  });

  it('should delete a post', async () => {
    await apiClient.delete('/posts/1');
    // In a real test, you would verify that the post is actually deleted.
  });
});