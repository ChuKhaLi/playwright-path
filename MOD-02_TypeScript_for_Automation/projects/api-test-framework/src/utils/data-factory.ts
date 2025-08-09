import { Post } from '../types';

export class DataFactory {
  static createPost(overrides: Partial<Omit<Post, 'id'>> = {}): Omit<Post, 'id'> {
    const defaultPost = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    return { ...defaultPost, ...overrides };
  }
}