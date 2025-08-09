import { BaseApiClient } from '../BaseApiClient';
import { APIRequestContext } from '@playwright/test';

// Add your User-related types here, e.g.:
// export interface User { ... }
// export interface CreateUserRequest { ... }

export class UserApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, config: { baseUrl: string }) {
    super(request, config);
  }

  async createUser(userData: any): Promise<any> {
    const response = await this.executeRequest('POST', '/users', {
      data: userData,
      expectedStatus: 201
    });
    return response.json();
  }

  async getUserById(userId: string): Promise<any> {
    const response = await this.executeRequest('GET', `/users/${userId}`, {
      expectedStatus: 200
    });
    return response.json();
  }

  async login(credentials: any): Promise<any> {
    const response = await this.executeRequest('POST', '/login', {
        data: credentials,
        expectedStatus: 200
    });
    const body = await response.json();
    if (body.token) {
        this.setAuthToken(body.token);
    }
    return body;
  }
}