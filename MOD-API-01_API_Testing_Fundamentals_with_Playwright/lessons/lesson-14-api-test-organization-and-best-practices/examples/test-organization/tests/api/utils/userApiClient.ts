/**
 * @fileoverview This file contains an API client for the /users resource.
 * It encapsulates the logic for making requests to the user endpoints.
 */

import { APIRequestContext } from '@playwright/test';

export class UserApiClient {
  constructor(private request: APIRequestContext, private token?: string) {}

  private getAuthHeaders() {
    // In a real app, you'd likely have different auth strategies.
    // This client assumes Bearer token authentication if a token is provided.
    if (!this.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getUsers() {
    return this.request.get('/api/users', {
      headers: this.getAuthHeaders(),
    });
  }

  async getUserById(id: number) {
    return this.request.get(`/api/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async createUser(userData: { name: string; job: string }) {
    return this.request.post('/api/users', {
      data: userData,
      headers: this.getAuthHeaders(),
    });
  }

  async updateUser(id: number, userData: { name: string; job: string }) {
    return this.request.put(`/api/users/${id}`, {
      data: userData,
      headers: this.getAuthHeaders(),
    });
  }

  async deleteUser(id: number) {
    return this.request.delete(`/api/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}